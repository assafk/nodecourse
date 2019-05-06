const express = require('express');
const Chance = require('chance');
const ValidationError = require('./errors/validation');
const NotFoundError = require('./errors/not-found');

const router = express.Router();

const chance = new Chance();

const userData = userId => ({
  id: userId + 1,
  username: chance.name(),
  email: chance.email(),
  age: chance.age(),
});

const USER_LIMIT = 100;

const users = [];
for (let i = 0; i < USER_LIMIT; i += 1) {
  users.push(userData(i));
}

router.get('/', (req, res) => {
  const pageSize = 20;
  const {
    page = 1,
  } = req.query;
  const pageStart = (page - 1) * pageSize;
  const userResults = users.slice(pageStart, pageStart + pageSize);
  res.json(userResults);
});

router.get('/:userId', (req, res) => {
  const {
    userId,
  } = req.params;
  const userIdNumber = parseInt(userId, 10);
  if (isNaN(userIdNumber) || userIdNumber < 1) {
    throw new ValidationError('userId', userId);
  }
  if (userIdNumber > USER_LIMIT) {
    throw new NotFoundError('userId');
  }
  res.json(users[userIdNumber - 1]);
});

module.exports = router;