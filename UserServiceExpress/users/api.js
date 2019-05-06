const users = require('./users');
const express = require('express');
const router = express.Router();
//router.get('/', (req, res) => res.send('hello api'));
router.use('/users', users);

module.exports = router;