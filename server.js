'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose = require('mongoose');
const UserBooks = require('./models/User.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const client = jwksClient({
  jwksUri: 'https://tianyi.us.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key){
    let sigingKey = key.publicKey || key.rsaPublicKey;
    callback(null, sigingKey);
  });
}

app.get('/test', (req, res) => {

  // TODO: 
  // STEP 1: get the jwt from the headers
  const token = req.headers.authorization.split(' ')[1];
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
  jwt.verify(token, getKey, {}, function(err, user){
    if(err) {
      res.send('invalid token');
    } else {
      res.json({ 'token': token});
    }
  });

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// connecting mongoose
mongoose.connect('mongodb://localhost:27017/books', mongooseOptions);

// creating user object and add books to database

let tim = new UserBooks({
  email: 'tim.ma0118@gmail.com',
  books:[
    {
      name: 'Harry Potter',
      description: 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling',
      status: 'Finished reading it'
    },
    {
      name: 'The Lord of the Rings',
      description: 'The Lord of the Rings is an epic[1] high fantasy novel[a] by the English author and scholar J. R. R. Tolkien',
      status: 'Finished reading it'
    },
    {
      name: 'The Three-Body Problem',
      description: 'The Three-Body Problem is a science fiction novel by the Chinese writer Liu Cixin',
      status: 'Wanted to read'
    }
  ]
});
tim.save();

app.get('/books', getBooks);

function getBooks(req, res){
  UserBooks.find({})
    .then(books => {
      res.json(books);
    })
}

app.post('/books', createBooks);

function createBooks(req, res) {
  let user = new UserBooks(req.body);
  user.save()
    .then(user => {
      res.json(user);
    })
}