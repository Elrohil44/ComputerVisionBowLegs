const assert = require('assert');
const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;

assert(MONGODB_URL, 'Missing MONGODB_URL');

const connectToDatabase = async () => {
  await mongoose.connect(MONGODB_URL, {
    poolSize: 20,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectToDatabase;
