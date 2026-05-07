const mongoose = require('mongoose');

const botSchema = new mongoose.Schema(
  {
    botId: {
      type: String,
      required: [true, 'Bot ID is required'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Unnamed Bot',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one bot per user
botSchema.index({ botId: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Bot', botSchema);
