import Router from 'koa-router';
import { menuController } from '../controllers/menuController';

const router = new Router();
const { getMenus, menuTableData, save, del, getParentMenus } = menuController()

router.post('/getMenus', getMenus)
router.post('/getParentMenus', getParentMenus)
router.post('/menuTableData', menuTableData)
router.post('/save', save)
router.post('/delete', del)

export default router;