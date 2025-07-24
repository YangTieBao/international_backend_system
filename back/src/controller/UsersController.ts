import { Body, Controller, Post, Query, Res } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';
import { UsersDao } from '../dao/UsersDao';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '2h'; 
const COOKIE_MAX_AGE = 2 * 60 * 60 * 1000;

const { return_200, return_401 } = responses()
const { routerError } = errors()
const { handleEncryptedRequest } = encrypt_decrypt()

@Controller('/users')
export default class UsersController {
  private readonly usersDao = new UsersDao();

  @Post('/login')
  async login(@Body() body, @Res() res) {
    try {
      const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
      const { username, password } = jsonDecryptedData || {}
      const sql = `select * from users where (loginAccount = ? or phone = ? ) and password = ?`
      const results = await UsersDao.query(sql, [username, username, password])

      // 验证用户是否存在
      if (results.length === 0) {
        return return_401('用户名/手机号或密码错误')
      }

      const userInfo = {
        id: user.id,
        username: user.loginAccount,
        phone: user.phone,
        roleId: user.roleId // 假设用户表有角色ID字段
      };

      // 6. 生成JWT token
      const token = jwt.sign(
        { ...userInfo },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 7. 设置Cookie（包含token和基本用户信息）
      res.cookie('authToken', token, {
        maxAge: COOKIE_MAX_AGE, // 有效期2小时
        httpOnly: true, // 防止前端JS访问，增强安全性
        secure: process.env.NODE_ENV === 'production', // 生产环境启用HTTPS
        path: '/' // 全站有效
      });

      return res.json({
        code: 200,
        message: '登录成功',
        data: {
          user: userInfo,
          expiresIn: JWT_EXPIRES_IN
        }
      });
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
