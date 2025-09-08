import Router from 'koa-router';
import { menuController } from '../controllers/menuController';

const router = new Router();
const { getMenus, menuTableData } = menuController()

router.post('/getMenus', getMenus)
router.post('/menuTableData', menuTableData)

export default router;