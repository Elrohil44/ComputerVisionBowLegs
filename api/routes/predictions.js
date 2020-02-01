const { Router } = require('express');
const { asyncWrapper } = require('../utils');

const { Prediction } = require('../models');

const router = new Router();

router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const predictions = await Prediction.find().lean();
    res.send(predictions);
  }),
);

module.exports = router;
