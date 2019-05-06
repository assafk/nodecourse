const express = require('express');
const api = require('./api');
const ValidationError = require('./errors/validation');
const NotFoundError = require('./errors/not-found');

const app = express();
app.use('/api', api);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    const {
      field,
      value,
    } = err;
    res.status(400).send(`${field} with value ${value} is invalid`);
  } else if (err instanceof NotFoundError) {
    const {
      field,
    } = err;
    res.status(404).send(`${field} not found`);
  }
  next();
});

app.listen(8222, () => console.log('listen on 8222'));