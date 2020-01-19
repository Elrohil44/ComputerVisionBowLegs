const express = require('express');
const connectToDatabase = require('./db');
const Prediction = require('./models/Prediction');
const { publishMessage } = require('./kafka');

connectToDatabase()
  .then(() => console.log('Successfully connected to database'))
  .catch((error) => console.error('Could not connect to database', error));

const app = express();
const port = 5000;

const asyncWrapper = (func) => (req, res, next) => Promise.resolve()
  .then(() => func(req, res, next))
  .catch(next);

app.get('/', asyncWrapper((req, res, next) => {
  publishMessage(Buffer.from(new Array(30).fill().map(() => Math.floor(255 * Math.random()))).toString('hex'));
  new Prediction({ path: 'asdasdas' }).save().then((result) => res.send(result)).catch(next);
}));

app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`API started on port ${port}!`));
