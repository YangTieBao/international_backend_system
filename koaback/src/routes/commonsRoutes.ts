import Router from 'koa-router';
import { commonsController } from '../controllers/commonsController';

const router = new Router();
const { getPublicKey, languages } = commonsController()

router.get('/getPublicKey', getPublicKey)

router.post('/languages', languages)


export default router;