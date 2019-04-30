const Chance = require('chance');
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
  res.json(getUser(userId));
});

module.exports = router;