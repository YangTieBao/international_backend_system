import Router from 'koa-router';
import { menuController } from '../controllers/menuController';

const router = new Router();
const { getMenus } = menuController()

router.post('/getMenus', getMenus)

export default router;