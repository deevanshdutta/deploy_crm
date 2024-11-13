import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Update customer total spending when order is completed
orderSchema.post('save', async function (doc) {
  if (doc.status === 'completed') {
    const Customer = mongoose.model('Customer');
    await Customer.findByIdAndUpdate(doc.customerId, {
      $inc: { totalSpending: doc.amount },
    });
  }
});

export default mongoose.model('Order', orderSchema);