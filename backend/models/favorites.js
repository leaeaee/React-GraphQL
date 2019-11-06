const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  favoritesProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  }, {timestamps: true}
);

module.exports = mongoose.model('Favorites', favoritesSchema);
