'use strict';

const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://tianyi.us.auth0.com/.well-known/jwks.json',
});

module.exports = (header, callback) => {
  client.getSigningKey(header.kid, function(err, key){
    let sigingKey = key.publicKey || key.rsaPublicKey;
    callback(null, sigingKey);
  });
}
