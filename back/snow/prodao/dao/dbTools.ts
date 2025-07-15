/**
 * 转换所有数据对象的key值为大驼峰，支持对象和对象数组。
 * @param {Array | Object} data 需要转换的数据
 */
export function transformDatabaseFiledToBigCamelCase(data: any): any {
  if (!data) return;
  if (Array.isArray(data)) {
    return data.map((d) => (typeof d === 'object' ? transformDatabaseFiledToBigCamelCase(d) : d));
  }
  const newData: any = {};
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      newData[bigCamelCase(key)] = data[key].map((d) =>
        typeof d === 'object' ? transformDatabaseFiledToBigCamelCase(d) : d,
      );
    } else {
      newData[bigCamelCase(key)] = data[key];
    }
  });
  return newData;
}

/**
 * 转换所有数据对象的key值为小驼峰，支持对象和对象数组。
 * @param {Array | Object} data 需要转换的数据
 */
export function transformDatabaseFiledToSmallCamelCase(data: any): any {
  if (!data) return;
  if (Array.isArray(data)) {
    return data.map((d) => (typeof d === 'object' ? transformDatabaseFiledToSmallCamelCase(d) : d));
  }
  const newData: any = {};
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      newData[smallCamelCase(key)] = data[key].map((d) =>
        typeof d === 'object' ? transformDatabaseFiledToSmallCamelCase(d) : d,
      );
    } else {
      newData[smallCamelCase(key)] = data[key];
    }
  });
  return newData;
}

/**
 * 转换所有数据对象的key值为下划线，支持对象和对象数组。
 * @param {Array | Object} data 需要转换的数据
 */
export function transformFieldToStyleHyphen(data: any): any {
  if (!data) return;
  if (Array.isArray(data)) {
    return data.map((d) => (typeof d === 'object' ? transformFieldToStyleHyphen(d) : d));
  }
  const newData: any = {};
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      newData[styleHyphenFormat(key)] = data[key].map((d) =>
        typeof d === 'object' ? transformFieldToStyleHyphen(d) : d,
      );
    } else {
      newData[styleHyphenFormat(key)] = data[key];
    }
  });
  return newData;
}

/**
 * 下划线连接转大驼峰
 * @param {string} fieldName 需要转换的字符串
 */
export function bigCamelCase(fieldName: string) {
  const stringPices = fieldName.split('_');
  const bigCamelCaseStringPices = stringPices.map((s) => s.substring(0, 1).toUpperCase() + s.substring(1));
  return bigCamelCaseStringPices.join('');
}

/**
 * 下划线连接转小驼峰
 * @param {string} fieldName 需要转换的字符串
 */
export function smallCamelCase(fieldName: string) {
  const stringPices = fieldName.split('_');
  const bigCamelCaseStringPices = stringPices.slice(1).map((s) => s.substring(0, 1).toUpperCase() + s.substring(1));
  return [stringPices[0], ...bigCamelCaseStringPices].join('');
}

/**
 * 大驼峰转下划线连接
 * @param {string} propertyName 需要转换的字符串
 */
export function styleHyphenFormat(propertyName: string) {
  function upperToHyphenLower(match: string) {
    return `_${match.toLowerCase()}`;
  }
  const firstLetter = propertyName.substring(0, 1).toLowerCase();
  const afterLetter = propertyName.substring(1).replace(/[A-Z]/g, upperToHyphenLower);
  return firstLetter + afterLetter;
}

/**
 * 查询对象转SQL where 语句
 * @param {object} search 查询参数
 * @return {string} where语句
 */
export function sqlWhere(search: { [index: string]: object }): [string, any[]] {
  if (!search) return ['', []];
  const sqlPices: Array<string> = [];
  const values: any[] = [];
  Object.keys(search).forEach((key) => {
    if (typeof search[key] !== 'undefined') {
      const field = styleHyphenFormat(key);
      sqlPices.push(` \`${field}\` = ?`);
      values.push(search[key]);
    }
  });
  return [sqlPices.length > 0 ? ` where${sqlPices.join(' and')}` : '', values];
}

export function sqlUpdateSet(bean: { [index: string]: object }) {
  const sqlPices: Array<string> = [];
  Object.keys(bean).forEach((key) => {
    const field = styleHyphenFormat(key);
    if (field !== 'id' && typeof bean[key] !== 'undefined') {
      sqlPices.push(`\`${field}\` = ?`);
    }
  });
  return sqlPices.length > 0 ? ` set${sqlPices.join(',')}` : '';
}

export function updateSqlValues(bean: { [index: string]: object }, id: string | number) {
  const values = [];
  Object.keys(bean).forEach((key) => {
    const field = styleHyphenFormat(key);
    if (field !== 'id' && typeof bean[key] !== 'undefined') {
      values.push(bean[key]);
    }
  });
  if (values.length > 0) values.push(id);
  return values;
}

// 数据处理拦截器
export function rowsDataIntercept(rows: Array<{ [index: string]: object }>) {
  if (!Array.isArray(rows)) return;
  rows?.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (row[key] instanceof Date) {
        row[key] = row[key].valueOf();
      }
    });
  });
}
