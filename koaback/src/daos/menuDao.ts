import { pool } from "../config/database"

export const MenuDao = () => {
  // 获取菜单栏
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

  // 获取菜单列表
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

  // 获取菜单总数量
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

  // 获取父菜单
  const getParentMenus = async (grade: number) => {
    const sql = `
        select 
          id,title 
        from 
          menus
        where
          isNeddChild = 1
          ${grade ? `and grade = ${grade - 1}` : ``}
      `;
    const [result] = await pool.query(sql) as any
    return result
  }

  // 保存菜单（新增或编辑）
  const save = async (requestBody: any) => {
    const { id, title, path,
      parent_id,
      parent_name,
      grade,
      sort,
      username,
      currentTime,
      user_id
    } = requestBody

    let type
    if (grade === 0) {
      type = 0
    } else {
      type = 1
    }

    if (id) {
      const sql = `
        UPDATE menus 
        SET 
          title = ?, 
          path = ?, 
          parent_id = ?, 
          parent_name = ?,
          grade = ?,
          type = ?,
          sort = ?, 
          updatedTime = ?,
          updatedBy = ?
        WHERE 
          id = ?
      `;
      // 执行更新
      await pool.query(sql, [
        title,
        path,
        parent_id || 0,  // 处理可能的空值
        parent_name,
        grade,
        type,
        sort || 0,         // 提供默认排序值
        currentTime,
        username,
        id
      ]);
    }
    // 新增操作 - 不存在id时
    else {
      const sql = `
        INSERT INTO menus 
          (title, path, parent_id,parent_name,grade,type, sort, createdTime, createdBy, updatedTime, updatedBy)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
      `;
      // 执行插入
      const [result] = await pool.query(sql, [
        title,
        path,
        parent_id || 0,
        parent_name,
        grade,
        type,
        sort || 0,
        currentTime,
        username,
        currentTime,
        username,
      ]) as any;

      if (user_id === 1) {
        const sql2 = `
          INSERT INTO role_menus 
            (role_id,menu_id)
          VALUES 
            (?, ?)
        `;
        await pool.query(sql2, [user_id, result.insertId])
      }
    }
    return true
  }

  // 删除菜单
  const del = async (id: string | number) => {
    const sql = `
      delete from 
        menus
      where
        id = ?
    `
    const [result] = await pool.query(sql, [id]) as any

    if (result.affectedRows > 0) {
      return true; // 删除成功
    } else {
      return false; // 没有匹配的记录可删除
    }
  }

  return { getMenus, menuTableData, totalCount, save, del, getParentMenus }
}