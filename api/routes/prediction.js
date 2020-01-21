const assert = require('assert');
const { Router } = require('express');
const sharp = require('sharp');
const fileUpload = require('express-fileupload');
const { asyncWrapper, authorize } = require('../utils');
const { publishMessage } = require('../kafka');

const { Prediction } = require('../models');

const router = new Router();

const IMAGES_DIR = '/var/content/static';
const SOURCES_DIR = 'sources';

const { WORKER_API_TOKEN } = process.env;

assert(WORKER_API_TOKEN, 'Missing worker\'s API Token');

router.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const prediction = await Prediction.findById(id);
    res.send(prediction);
  }),
);

router.post(
  '/',
  fileUpload(),
  asyncWrapper(async (req, res) => {
    const prediction = new Prediction({
      status: 'QUEUED',
    });
    prediction.sourcePath = `${SOURCES_DIR}/${prediction.id}.jpeg`;
    await sharp(req.files.image.data)
      .jpeg({ quality: 100, progressive: true })
      .toFile(`${IMAGES_DIR}/${prediction.sourcePath}`);

    await prediction.save();
    await publishMessage(JSON.stringify({
      id: prediction.id,
      sourcePath: prediction.sourcePath,
    }));

    res.status(201).send(prediction);
  }),
);

router.put(
  '/:id',
  authorize(WORKER_API_TOKEN),
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Prediction.updateOne({ _id: id }, { $set: req.body });
    res.status(204).send();
  }),
);

module.exports = router;
