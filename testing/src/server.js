const express = require('express');
const bodyParser = require('body-parser');
const ProductService = require('./services/product');

const {
  Order,
  Product
} = require('./model');

const app = express();
app.use(bodyParser.json());

app.post('/order', async (req, res) => {
  const order = await Order.create({});
  res.json(order);
});

app.get('/order', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

app.post('/product', async (req, res) => {
  const {
    quantity,
    name,
    orderId
  } = req.body;

  await ProductService.addProductToOrder(name, quantity, orderId);

  res.json({
    quantity,
    name,
    orderId
  });
})

app.get('/product', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

module.exports = app.listen(8222, () => console.log("Listening on 8222"));