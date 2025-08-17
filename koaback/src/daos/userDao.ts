import { pool } from '../config/database'

export const UserDao = () => {
  const getUserInfo = async (username: string | number, password: string) => {
    const sql = `
        select 
          t1.id as user_id,t1.name,t1.age,t1.sex,t1.loginAccount as username,t1.defaultLanguage,
          t2.id as role_id,t2.type as role_type,t2.description as role_description
        from 
          users as t1
        left join 
          user_roles as t3 on t3.user_id = t1.id
        left join 
          roles as t2 on t2.id  = t3.role_id
        where 
          (t1.loginAccount = ? or t1.phone = ? ) and t1.password = ?
      `
    const [userInfo] = await pool.query(sql, [username, username, password]) as any

    return userInfo[0]
  }

  return { getUserInfo }
}