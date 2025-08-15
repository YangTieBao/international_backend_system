-- 创建数据库
CREATE DATABASE IF NOT EXISTS test_db;
USE test_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

-- 插入测试数据
INSERT INTO users (name, email, age, created_at, updated_at)
VALUES 
  ('John Doe', 'john@example.com', 30, NOW(), NOW()),
  ('Jane Smith', 'jane@example.com', 28, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  age = VALUES(age),
  updated_at = NOW();
