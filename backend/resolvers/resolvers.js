const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const Favorites = require('../models/favorites');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const checkIfAdmin = mail => {
  if (mail === 'admin@admin' || mail === 'lea@lea') return true;
  return false;
};

const resolvers = {
  Query: {
    products: async () => {
      const products = await Product.find({}).lean();
      return Object.values(products);
    },
    cart: async (_, args, { currentUserId }) => {
      let carts = await Cart.find({ user: currentUserId }).lean();
      carts = carts.map(async cart => {
        const product = await Product.findById(cart.product).lean();
        return {
          ...cart,
          product
        };
      });
      return Object.values(carts);
    },
    favorites: async (_, args, { currentUserId }) => {
      let favoritesItems = await Favorites.find({ user: currentUserId }).lean();
      favoritesItems = favoritesItems.map(async item => {
        const product = await Product.findById(item.product).lean();
        return {
          ...item,
          product
        };
      });
      return Object.values(favoritesItems);
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) throw new Error('User does not exist!');

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error('Password is incorrect!');

      const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });
      return { userId: user.id, token: token, tokenExpiration: 1, isAdmin: checkIfAdmin(email) };
    },
    orders: async (_, args, { currentUserId }) => {
      let orders = await Order.find({ userId: currentUserId }).lean();

      const products = Object.values(orders).map(order => ({ products: order.carts.pop().products }));

      return products;
    }
  },
  Mutation: {
    createUser: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email: email }).lean();
      if (existingUser) throw new Error('User exists already.');

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPassword,
        isAdmin: checkIfAdmin(email)
      });
      const result = await user.save();
      console.log(result);

      return { email: result.email, password: null, id: result._id, isAdmin: result.isAdmin };
    },

    addToCart: async (_, { productId, size }, { currentUserId }) => {
      if (!currentUserId) throw new Error('Unauthenticated!');

      const fetchedProduct = await Product.findById(productId).lean();
      const fetchedUser = await User.findById(currentUserId).lean();

      const cart = new Cart({
        user: currentUserId,
        product: fetchedProduct,
        size: size
      });
      const result = await cart.save();
      return { ...result, _id: result._id, size: result.size, product: fetchedProduct, user: fetchedUser };
    },

    removeFromCart: async (_, args, { currentUserId }) => {
      if (!currentUserId) throw new Error('Unauthenticated!');

      try {
        const res = await Cart.deleteOne({ _id: args.cartId });
        console.log('delete, result cart', res);
        return cart;
      } catch (err) {
        throw err;
      }
    },

    addToFavorites: async (_, args, { currentUserId }) => {
      const fetchedProduct = await Product.findById(args.productId);

      const favorites = new Favorites({
        user: currentUserId,
        product: fetchedProduct
      });
      const result = await favorites.save();
      return result;
    },

    removeFromFavorites: async (_, { favoritesId }, { currentUserId }) => {
      if (!currentUserId) throw new Error('Unauthenticated!');

      try {
        const res = await Favorites.deleteOne({ _id: favoritesId });
        return favoritesId;
      } catch (err) {
        throw err;
      }
    },

    createProduct: async (_, { productData: { title, description, price, date } }, { currentUserId }) => {
      if (!currentUserId) throw new Error('createProduct: Unauthenticated!');

      const product = new Product({
        title: title,
        description: description,
        price: +price,
        date: new Date(date).toISOString(),
        creator: currentUserId
      });

      try {
        const result = await product.save();
        const creator = await User.findById(currentUserId);

        if (!creator) throw new Error('createProduct: User not found.');

        creator.createdProducts.push(product);
        await creator.save();
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    deleteProduct: async (_, args, {currentUserId} ) => {

      if (!currentUserId) throw new Error('deleteProduct: Unauthenticated!');
      
            try {
              const res = await Product.deleteOne({ _id: args.productId });
              return res;
            } catch (err) {
              throw err;
            }
    },

    makeOrder: async (_, { order: products }, { currentUserId }) => {
      if (!currentUserId) throw new Error('makeOrder: Unauthanticated!');

      try {
        const order = new Order({
          userId: currentUserId,
          carts: products
        });
        const result = await order.save();

        if (result) await Cart.deleteMany({ user: currentUserId });

        return { products: result.carts.pop().products, userId: result.userId };
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports = resolvers;
