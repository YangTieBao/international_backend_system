import Router from 'koa-router';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller';

const router = new Router();

// 获取所有用户
router.get('/', getAllUsers);

// 获取单个用户
router.get('/:id', getUserById);

// 创建用户
router.post('/', createUser);

// 更新用户
router.put('/:id', updateUser);

// 删除用户
router.delete('/:id', deleteUser);

export default router;
