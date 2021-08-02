'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const Book = require('./modules/book.js');
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(cors());
app.use(express.json());

// connecting mongoose
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.use('*', (req, res) => {
  res.status(404),send('rout not found');
})

app.get('/books', Book.show);
app.post('/books', Book.add);
app.put('/books', Book.update);
app.delete('/books', Book.delete);

