import { pool } from '../config/database';

export interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  created_at?: Date;
  updated_at?: Date;
}

// 获取所有用户
export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.execute('SELECT * FROM users');
  return rows as User[];
};

// 获取单个用户
export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

// 创建用户
export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const { name, email, age } = user;
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, age, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [name, email, age || null]
  );
  
  // @ts-ignore
  const newUserId = result.insertId;
  return await getUserById(newUserId);
};

// 更新用户
export const updateUser = async (id: number, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> => {
  // 检查用户是否存在
  const existingUser = await getUserById(id);
  if (!existingUser) {
    return null;
  }
  
  // 构建更新语句
  const updates = [];
  const values = [];
  
  if (user.name !== undefined) {
    updates.push('name = ?');
    values.push(user.name);
  }
  
  if (user.email !== undefined) {
    updates.push('email = ?');
    values.push(user.email);
  }
  
  if (user.age !== undefined) {
    updates.push('age = ?');
    values.push(user.age);
  }
  
  updates.push('updated_at = NOW()');
  values.push(id);
  
  await pool.execute(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  return await getUserById(id);
};

// 删除用户
export const deleteUser = async (id: number): Promise<boolean> => {
  // 检查用户是否存在
  const existingUser = await getUserById(id);
  if (!existingUser) {
    return false;
  }
  
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return true;
};
