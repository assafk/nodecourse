const merge = require('deepmerge');

module.exports = merge.all([
  require('./common'),
  require(`./${process.env.NODE_ENV}`),
]);