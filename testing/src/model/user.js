const Sequelize = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  },
  country: {
    type: Sequelize.STRING
  },
  photo: {
    type: Sequelize.STRING
  },
}, {
  timestamps: false,
});

module.exports = User;