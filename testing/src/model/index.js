const Product = require('./product');
const Order = require('./order');

Order.hasMany(Product, {
  as: 'product',
  foreignKey: 'order_id'
});

module.exports = {
  Product,
  Order,
};