'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

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
