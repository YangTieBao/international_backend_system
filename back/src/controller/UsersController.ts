import { Body, Controller, Post, Query, Res } from '@snow';
import { encrypt_decrypt, generateJWTSecret } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';
import { UsersDao } from '../dao/UsersDao';

const jwt = require('jsonwebtoken');
const jwt_secret = generateJWTSecret();
const cookie_jwt_validity_period = 2 * 60 * 60 * 1000;

const { return_200, return_401 } = responses()
const { routerError } = errors()
const { handleEncryptedRequest } = encrypt_decrypt()

@Controller('/users')
export default class UsersController {
  private readonly usersDao = new UsersDao();

  @Post('/login')
  async login(@Res() res, @Body() body) {
    try {
      const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
      const { username, password } = jsonDecryptedData || {}
      const sql = `select * from users where (loginAccount = ? or phone = ? ) and password = ?`
      const results = await UsersDao.query(sql, [username, username, password])

      if (results.length === 0) {
        return return_401('用户名/手机号或密码错误')
      }

      const userInfo = results[0]

      const userJwt = {
        id: results[0].id,
        username: results[0].loginAccount,
        phone: results[0].phone
      };

      const token = jwt.sign(
        { ...userJwt },
        jwt_secret,
        { expiresIn: cookie_jwt_validity_period }
      );

      res.cookie('jwtToken', token, {
        maxAge: cookie_jwt_validity_period,
        httpOnly: true,
        domain: '127.0.0.1',
        sameSite: 'Lax', // https需为None
        secure: false, // https需为true
        path: '/', // 全站有效
      });

      return return_200(userInfo, symmetricKey, body)

    } catch (err) {
      routerError('/users/login', err)
    }
  }

  @Post('/addUsers')
  async addUsers(@Body() body) {
    return await this.usersDao.insert(body);
  }

  @Post('/findUsersById')
  async findUsers(@Query('id') id) {
    return await this.usersDao.selectOne(id);
  }

  @Post('/findUsersList')
  async findUsersList(@Body() body) {
    const { page, size, ...queryParams } = body;
    return await this.usersDao.selectPage(queryParams, { page, size }, { dirc: 'desc', field: 'ctime' });
  }

  @Post('/editUsers')
  async editUsers(@Body() body) {
    return await this.usersDao.update(body.id, body);
  }

  @Post('/deleteUsers')
  async deleteUsers(@Query('id') id) {
    return await this.usersDao.deleteById(id);
  }
}
