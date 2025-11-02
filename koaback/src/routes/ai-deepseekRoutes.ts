import Router from 'koa-router';
import { deepseekController } from '../controllers/AI-deepseekController';

const router = new Router();
const { aiDeepseekChat } = deepseekController()

router.post('/chat', aiDeepseekChat);

export default router;