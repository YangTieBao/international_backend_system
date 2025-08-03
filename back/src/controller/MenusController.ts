import { Body, Controller, Get, Post, Query } from '@snow';
import { MenusDao } from '../dao/MenusDao';

@Controller('/menus')
export default class MenusController {
  private readonly menusDao = new MenusDao();

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
