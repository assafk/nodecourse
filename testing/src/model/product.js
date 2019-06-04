const Sequelize = require('sequelize');
const sequelize = require('./connection');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.INTEGER
  },
}, {
  timestamps: false,
});

module.exports = Product;