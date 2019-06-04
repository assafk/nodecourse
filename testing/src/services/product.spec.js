const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require("sinon-chai");

const {
  Product
} = require('../model');
const ProductService = require('./product');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const expect = chai.expect;

describe('test add product', () => {
  afterEach(function () {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });
  it('bad parameters', async () => {
    expect(ProductService.addProductToOrder('some name', 300, 1))
      .to.eventually.rejectedWith('Quantity above 10 is not allowed');
    expect(ProductService.addProductToOrder('some name', 0, 1))
      .to.eventually.rejectedWith('Quantity must be positive number');
  });
  it('create new product', async () => {
    sandbox.stub(Product, 'findOne').resolves(undefined);
    sandbox.stub(Product, 'create').resolves(undefined);
    await ProductService.addProductToOrder('some name', 5, 1);
    expect(Product.findOne).to.have.been.calledOnce;
    expect(Product.create).to.have.been.calledOnceWith({
      order_id: 1,
      name: 'some name',
      quantity: 5,
    });
  });
  it('update existing product', async () => {
    const fakeProduct = {
      order_id: 1,
      quantity: 6,
      name: 'some name',
      update: sinon.stub()
    };
    sandbox.stub(Product, 'findOne').resolves(fakeProduct);
    sandbox.stub(Product, 'create').resolves(undefined);
    await ProductService.addProductToOrder('some name', 5, 1);

    expect(Product.findOne).to.have.been.calledOnce;
    expect(fakeProduct.update).to.have.been.calledOnceWith({
      quantity: 11
    });
  })
});