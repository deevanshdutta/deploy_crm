import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  conjunction: {
    type: String,
    enum: ['AND', 'OR'],
  },
});

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    conditions: [conditionSchema],
    audienceSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Segment', segmentSchema);