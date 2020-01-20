const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db');
const routes = require('./routes');

connectToDatabase()
  .then(() => console.log('Successfully connected to database'))
  .catch((error) => console.error('Could not connect to database', error));

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`API started on port ${port}!`));
