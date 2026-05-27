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
    size: { type: String },
    prescription: {
      type: mongoose.Schema.Types.Mixed, 
      default: null
    }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  whatsappRedirected: { type: Boolean, default: true },
}, { timestamps: true });

// Force clear cached model in development to prevent Mongoose schema hot-reload cache bugs
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
