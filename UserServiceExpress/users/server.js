const express = require('express');
const api = require('./api');
const app = express();
app.use('/api', api);
app.get('/', (req, res) => {
  res.send('hello');
})
app.listen(8222, () => console.log('Listening on 8222'));
app.use((err, req, res, next) => {
  console.log(err);
})