const { Router } = require('express');

const prediction = require('./prediction');
const predictions = require('./predictions');

const router = new Router();

router.use('/prediction', prediction);
router.use('/predictions', predictions);

module.exports = router;
