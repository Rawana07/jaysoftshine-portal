import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'] },
  errorMessage: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);