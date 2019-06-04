const Sequelize = require('sequelize');

const {
  db: {
    url,
    user,
    password,
    database
  }
} = require('../config');

const sequelize = new Sequelize(database, user, password, {
  host: url,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;