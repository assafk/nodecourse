process.env.NODE_ENV = 'development';

const app = require('./server');
const chai = require('chai');
const request = require('supertest');

const {
  Product,
  Order
} = require('./model');

const expect = chai.expect;

describe('users route', async () => {
  beforeEach(async () => {
    // Clean users table before each test
    await Product.destroy({
      where: {}
    });
    await Order.destroy({
      where: {}
    });
  });
  afterEach(async () => {
    await app.close();
  });
  it('tests getting all orders from empty table', async () => {
    const res = await request(app).get('/order').expect(200);
    expect(res.body).to.be.an('array').with.length(0);
  });
  it('tests adding order', async () => {
    await request(app).post('/order').send();
    let res = await request(app).get('/order').expect(200);

    expect(res.body).to.be.an('array').with.length(1);
  });
  it('tests adding product', async () => {
    const order = await request(app)
      .post('/order').send();
    let res = await request(app).get('/order').expect(200);
    expect(res.body).to.be.an('array').with.length(1);

    res = await request(app).get('/product').expect(200);
    expect(res.body).to.be.an('array').with.length(0);

    await request(app).post('/product').send({
      name: 'prod1',
      quantity: 3,
      orderId: order.body.id
    });
    res = await request(app).get('/product').expect(200);
    expect(res.body).to.be.an('array').with.length(1);
    expect(res.body[0]).to.contain({
      name: 'prod1',
      quantity: 3,
    });
    await request(app).post('/product').send({
      name: 'prod1',
      quantity: 4,
      orderId: order.body.id
    });
    res = await request(app).get('/product').expect(200);
    expect(res.body).to.be.an('array').with.length(1);
    expect(res.body[0]).to.contain({
      name: 'prod1',
      quantity: 7,
    });
  })
});