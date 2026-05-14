import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: { 
    type: String, 
    enum: ['ITR', 'GST', 'Compliance', 'Document', 'Audit', 'Advisory'],
    required: true 
  },
  basePrice: { type: Number, required: true, default: 0 },
  icon: String,
  features: [String],
  requiredDocuments: [String],
  turnaroundTime: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);