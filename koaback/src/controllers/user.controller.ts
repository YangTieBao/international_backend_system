import { Context } from 'koa';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../services/user.service';

// 获取所有用户
export const getAllUsers = async (ctx: Context) => {
  try {
    const users = await getAllUsers();
    ctx.status = 200;
    ctx.body = {
      data: users,
      status: 'success'
    };
  } catch (error) {
    ctx.throw(500, 'Failed to fetch users');
  }
};

// 获取单个用户
export const getUserById = async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      ctx.throw(400, 'Invalid user ID');
    }
    
    const user = await getUserById(id);
    if (!user) {
      ctx.throw(404, 'User not found');
    }
    
    ctx.status = 200;
    ctx.body = {
      data: user,
      status: 'success'
    };
  } catch (error) {
    ctx.throw(500, 'Failed to fetch user');
  }
};

// 创建用户
export const createUser = async (ctx: Context) => {
  try {
    const { name, email, age } = ctx.request.body;
    
    if (!name || !email) {
      ctx.throw(400, 'Name and email are required');
    }
    
    const newUser = await createUser({ name, email, age });
    ctx.status = 201;
    ctx.body = {
      data: newUser,
      status: 'success',
      message: 'User created successfully'
    };
  } catch (error) {
    ctx.throw(500, 'Failed to create user');
  }
};

// 更新用户
export const updateUser = async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      ctx.throw(400, 'Invalid user ID');
    }
    
    const { name, email, age } = ctx.request.body;
    const updatedUser = await updateUser(id, { name, email, age });
    
    if (!updatedUser) {
      ctx.throw(404, 'User not found');
    }
    
    ctx.status = 200;
    ctx.body = {
      data: updatedUser,
      status: 'success',
      message: 'User updated successfully'
    };
  } catch (error) {
    ctx.throw(500, 'Failed to update user');
  }
};

// 删除用户
export const deleteUser = async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id);
    if (isNaN(id)) {
      ctx.throw(400, 'Invalid user ID');
    }
    
    const result = await deleteUser(id);
    if (!result) {
      ctx.throw(404, 'User not found');
    }
    
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'User deleted successfully'
    };
  } catch (error) {
    ctx.throw(500, 'Failed to delete user');
  }
};
