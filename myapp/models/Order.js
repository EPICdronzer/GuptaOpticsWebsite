import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    productId: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    color: { type: String },
    size: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  whatsappRedirected: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
