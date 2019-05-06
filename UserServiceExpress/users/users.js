const express = require('express');
const Chance = require('chance');
const ValidationError = require('./errors/validation');
const NotExistsError = require('./errors/not-exists');

const router = express.Router();
const chance = new Chance();
const getUser = (userId) => ({
  id: userId,
  username: chance.name,
  age: chance.age,
  email: chance.email
})

router.get('/:userId', (req, res) => {
  const {
    userId
  } = req;
  const userIdNumber = parseInt(userId);
  if (userIdNumber === NaN || userIdNumber < 0) {
    throw new ValidationError('userId', userId, 'only non negative numbers')
  }
  if (userIdNumber > 100) {
    throw new NotExistsError();
  }
  res.json(getUser(userId));
});

/*router.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    const {
      field,
      allowed
    } = err;
    res.status(400).send(`${field} is invalid - ${allowed}`);
  } else if (err instanceof NotExistsError) {
    res.status(404).send(`not exists`);
  }
})*/

module.exports = router;