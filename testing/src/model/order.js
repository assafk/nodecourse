const Sequelize = require('sequelize');
const sequelize = require('./connection');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
}, {
  timestamps: false,
});

module.exports = Order;