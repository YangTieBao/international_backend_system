import Router from 'koa-router';
import { userController } from '../controllers/userController';

const router = new Router();
const { login } = userController()

router.post('/login', login);


export default router;
