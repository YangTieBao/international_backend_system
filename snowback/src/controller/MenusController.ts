import { Body, Controller, Post, Query } from '@snow';
import { encrypt_decrypt } from '@utils/crypto';
import { errors } from '@utils/errors';
import { responses } from '@utils/response';
import { MenusDao } from '../dao/MenusDao';

const { return_200 } = responses()
const { routerError } = errors()
const { handleEncryptedRequest } = encrypt_decrypt()
@Controller('/menus')
export default class MenusController {
  private readonly menusDao = new MenusDao();

  @Post('/getMenus')
  async getMenus(@Body() body) {
    try {
      const { symmetricKey, jsonDecryptedData } = handleEncryptedRequest(body)
      const { user_id } = jsonDecryptedData
      const menuSql = `
        select 
          t1.*
        from 
          menus as t1
        left join 
          role_menus as t2 on t2.menu_id = t1.id
        left join 
          roles as t3 on t3.id  = t2.role_id
        where 
          t3.id = ?
        order by
          t1.sort asc
        `
      const menus = await MenusDao.query(menuSql, [user_id])
      return return_200({ menus }, symmetricKey, body)
    } catch (err) {
      routerError('/menus/getMenus', err)
    }
  }

  @Post('/addMenus')
  async addMenus(@Body() body) {
    return await this.menusDao.insert(body);
  }

  @Post('/findMenusById')
  async findMenus(@Query('id') id) {
    return await this.menusDao.selectOne(id);
  }

  @Post('/findMenusList')
  async findMenusList(@Body() body) {
    const { page, size, ...queryParams } = body;
    return await this.menusDao.selectPage(queryParams, { page, size }, { dirc: 'desc', field: 'ctime' });
  }

  @Post('/editMenus')
  async editMenus(@Body() body) {
    return await this.menusDao.update(body.id, body);
  }

  @Post('/deleteMenus')
  async deleteMenus(@Query('id') id) {
    return await this.menusDao.deleteById(id);
  }
}
