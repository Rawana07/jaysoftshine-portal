import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);