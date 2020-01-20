const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['QUEUED', 'IN_PROGRESS', 'COMPLETED'],
  },
  sourcePath: {
    type: String,
    required: true,
  },
  maskPath: String,
  predictionPath: String,
  inProgressSince: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Prediction', schema);
