import Router from 'koa-router';
import { menuController } from '../controllers/menuController';

const router = new Router();
const { getMenus, menuTableData, save, del } = menuController()

router.post('/getMenus', getMenus)
router.post('/menuTableData', menuTableData)
router.post('/save', save)
router.post('/del', del)

export default router;