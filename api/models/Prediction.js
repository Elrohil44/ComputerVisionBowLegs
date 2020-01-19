const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['QUEUED', 'IN_PROGRESS', 'COMPLETED'],
  },
  path: {
    type: String,
    required: true,
  },
  inProgressSince: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Prediction', schema);
