const crudGenerator = require('./plop-crud/index.js');

module.exports = function (plop) {
  plop.setGenerator('nest-crud', crudGenerator);
};
