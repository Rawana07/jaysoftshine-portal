import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerDetails: {
    name: String,
    email: String,
    phone: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  uploadedFiles: [{
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  notes: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'pending', 'completed', 'failed', 'refunded'], 
    default: 'unpaid' 
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  totalAmount: Number,
  discount: { type: Number, default: 0 },
  finalAmount: Number,
  paidAt: Date,
  completedAt: Date,
  receiptUrl: String,
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);