const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  size: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  }, {timestamps: true}
);

module.exports = mongoose.model('Cart', cartSchema);
