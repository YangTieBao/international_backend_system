/**
 * 下划线连接转大驼峰
 * @param {string} fieldName 需要转换的字符串
 */
function bigCamelCase(fieldName) {
  const stringPices = fieldName.split('_');
  const bigCamelCaseStringPices = stringPices.map((s) => s.substring(0, 1).toUpperCase() + s.substring(1));
  return bigCamelCaseStringPices.join('');
}

module.exports = {
  description: '生成CRUD模版',
  prompts: [
    {
      type: 'input',
      name: 'tablePrefix',
      message: '请输入表前缀：',
    },
    {
      type: 'input',
      name: 'tables',
      message: '请输入表名（多表以逗号隔开）：',
      validate: (v) => (!v || v.trim() === '' ? '表名不能为空' : true),
    },
  ],
  actions: (data) => {
    let { tablePrefix = '', tables } = data;
    tablePrefix = tablePrefix.trim();
    tables = tables.trim();
    const tableList = tables.split(',') || [];
    const bigCamelTableList = tableList.map((table) => bigCamelCase(table));
    const actions = [];

    tableList.forEach((tableName, index) => {
      const bigCamelTableName = bigCamelTableList[index];
      const acitonList = [
        {
          type: 'add',
          path: `src/controller/${bigCamelTableName}Controller.ts`,
          templateFile: 'plop-crud/template/controller.hbs',
          data: {
            tablePrefix,
            tableName,
            bigCamelTableName,
          },
        },
        {
          type: 'add',
          path: `src/dao/${bigCamelTableName}Dao.ts`,
          templateFile: 'plop-crud/template/dao.hbs',
          data: {
            tablePrefix,
            tableName,
            bigCamelTableName,
          },
        },
      ];
      actions.push(...acitonList);
    });

    return actions;
  },
};
