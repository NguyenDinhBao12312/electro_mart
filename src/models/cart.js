const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number,
  },
  Img: {
    type: String
  },
  type: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  items: [itemSchema]
}, { strict: false });


const db2 = mongoose.connection.useDb('user');
const Cart = db2.model('Cart', cartSchema);

module.exports = Cart;
