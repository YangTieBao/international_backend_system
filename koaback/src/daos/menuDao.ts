import { pool } from "../config/database"

export const MenuDao = () => {
    const getMenus = async (user_id: number) => {
        const sql = `
        select 
          t1.*
        from 
          menus as t1
        left join 
          role_menus as t2 on t2.menu_id = t1.id
        left join 
          roles as t3 on t3.id  = t2.role_id
        where 
          t3.id = ?
        order by
          t1.sort asc
        `
        const [menus] = await pool.query(sql, [user_id])

        return menus
    }


    return { getMenus }
}