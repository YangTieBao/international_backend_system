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

  const menuTableData = async (requestBody: any) => {
    const { pageSize, currentPage, menuName, menuGrade, menuPath } = requestBody
    const offset = (currentPage - 1) * pageSize

    let sql = `
      select 
        t1.*
      from 
        menus as t1
      where 
        1=1
    `

    const params = []

    if (menuName) {
      sql += ` and t1.title like ?`
      params.push(`%${menuName}%`)
    } else if (menuGrade || menuGrade == 0) {
      sql += ` and t1.grade like ?`
      params.push(`%${menuGrade}%`)
    } else if (menuPath) {
      sql += ` and t1.path like ?`
      params.push(`%${menuPath}%`)
    }

    sql += `
      order by 
        t1.sort asc
      limit 
        ?
      offset 
        ?
    `

    params.push(pageSize, offset);

    const [menuTableData] = await pool.query(sql, params);

    return menuTableData

  }

  const totalCount = async () => {
    const sql = `
        select 
          count(*) as total
        from 
          menus
        `
    const [total] = await pool.query(sql) as any

    return total[0].total
  }

  return { getMenus, menuTableData, totalCount }
}