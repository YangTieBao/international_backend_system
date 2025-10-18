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

  // 保存菜单（新增或编辑）
  const save = async (requestBody: any) => {
    const { id, name, path,
      parentId,
      sort,
      icon,
      component, } = requestBody

    if (id) {
      const sql = `
        UPDATE menus 
        SET 
          name = ?, 
          path = ?, 
          parent_id = ?, 
          sort = ?, 
          icon = ?, 
          component = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE 
          id = ?
      `;
      // 执行更新
      const [result] = await pool.query(sql, [
        name,
        path,
        parentId || null,  // 处理可能的空值
        sort || 0,         // 提供默认排序值
        icon,
        component,
        id
      ]);

      return {
        success: true,
        message: '菜单更新成功'
      };
    }
    // 新增操作 - 不存在id时
    else {
      const sql = `
        INSERT INTO menus 
          (name, path, parent_id, sort, icon, component, created_at, updated_at)
        VALUES 
          (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      // 执行插入
      const [result] = await pool.query(sql, [
        name,
        path,
        parentId || null,
        sort || 0,
        icon,
        component
      ]);

      return {
        success: true,
        message: '菜单创建成功'
      };
    }
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

  return { getMenus, menuTableData, totalCount, save, del }
}