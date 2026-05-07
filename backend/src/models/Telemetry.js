const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    botId: {
      type: String,
      required: [true, 'Bot ID is required'],
      trim: true,
      index: true,
    },
    distance: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      default: 0,
    },
    pesticide: {
      type: Number,
      default: 0,
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    tank: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Active', 'Idle', 'Offline', 'Error'],
      default: 'Idle',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast latest-telemetry queries
telemetrySchema.index({ botId: 1, createdAt: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
