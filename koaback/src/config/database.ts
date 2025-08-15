import mysql from 'mysql2/promise';

// 创建数据库连接池
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功！');
    connection.release();
  } catch (error) {
    console.log('数据库连接失败！');
    process.exit(1);
  }
};
