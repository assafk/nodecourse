const {
  Product,
  Order,
} = require('../model');

module.exports.addProductToOrder = async (productName, quantity, orderId) => {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive number')
  }
  if (quantity > 10) {
    throw new Error('Quantity above 10 is not allowed')
  }
  const product = await Product.findOne({
    where: {
      order_id: orderId,
      name: productName
    }
  });
  if (!product) {
    await Product.create({
      order_id: orderId,
      quantity,
      name: productName
    });
  } else {
    await product.update({
      quantity: product.quantity + quantity
    });
  }
}