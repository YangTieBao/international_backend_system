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
      const userSql = `
        select 
          t1.id as user_id,t1.name,t1.age,t1.sex,t1.loginAccount as username,t1.defaultLanguage,
          t2.id as role_id,t2.type as role_type,t2.description as role_description
        from 
          users as t1
        left join 
          user_roles as t3 on t3.user_id = t1.id
        left join 
          roles as t2 on t2.id  = t3.role_id
        where 
          (t1.loginAccount = ? or t1.phone = ? ) and t1.password = ?
      `
      const [userInfo] = await UsersDao.query(userSql, [username, username, password])

      if (!userInfo) {
        return return_401('用户名/手机号码或密码错误')
      }

      const token = jwt.sign(
        { ...userInfo },
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

      return return_200({ userInfo }, symmetricKey, body)

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
