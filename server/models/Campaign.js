import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    segmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent'],
      default: 'draft',
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    scheduledFor: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Campaign', campaignSchema);