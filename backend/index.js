const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = require('./schema/typeDefs.js');
const resolvers = require('./resolvers/resolvers.js');

const onPort = 8080;
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.use(bodyParser.json());

//ne kreira tu novi server, nego kao dodatne opcije servera (dodaje hrpu express middleware)
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let authToken = null;
    let currentUserId = null;

    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) return null;

      const token = authHeader.split(' ')[1];
      if (!token || token === '') return null;

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
      } catch (err) {
        console.log('Unable to decode token', decodedToken);
      }

      if (!decodedToken) return null;
      currentUserId = decodedToken.userId;
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${authToken}`);
    }

    return { currentUserId };
  }
});

//primjenjivanje middleware na express, ovo je kao app.use
graphqlServer.applyMiddleware({ app });

mongoose
  .connect(process.env.REACT_APP_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(onPort, () => console.log('[*] Server running on port', onPort)))
  .catch(err => console.log(err));
