import { Body, Controller, Post, Query } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';
import { UsersDao } from '../dao/UsersDao';

const { return_200 } = responses()
const { routerError } = errors()
const { handleEncryptedRequest } = encrypt_decrypt()

@Controller('/users')
export default class UsersController {
  private readonly usersDao = new UsersDao();

  @Post('/login')
  async login(@Body() body) {
    try {
      const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
      const { username, password } = jsonDecryptedData || {}
      const sql = `select * from users where loginAccount = ? and password = ?`
      const results = await UsersDao.query(sql, [username, password])
      console.log(results, '333333')
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
