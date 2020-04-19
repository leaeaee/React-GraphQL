const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    products: [Product!]!
    cart: [Cart]!
    orders: [Order]!
    favorites: [Favorites]!
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createProduct(productData: ProductInput!): Product
    deleteProduct(productId: ID!): Product!
    createUser(email: String!, password: String!): User
    addToCart(productId: ID!, size: String!): Cart!
    removeFromCart(cartId: ID!): Product!
    addToFavorites(productId: ID!): Favorites!
    removeFromFavorites(favoritesId: ID!): Product!

    makeOrder(order: OrderInput!): Order
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdProducts: [Product!]
    isAdmin: Boolean!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    isAdmin: Boolean!
  }

  type Product {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type Cart {
    _id: ID!
    product: Product!
    user: User!
    size: String!
    createdAt: String!
    updatedAt: String!
  }

  type Favorites {
    _id: ID!
    product: Product!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  input OrderInput {
    products: [ProductInput!]
  }

  input ProductInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type Order {
    _id: ID!
    userId: User!
    products: [Product!]
    carts: [Product!]
  }
`;

module.exports = typeDefs;
