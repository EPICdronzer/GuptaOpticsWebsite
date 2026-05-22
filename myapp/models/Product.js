import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String }, // e.g., Velvet, Urban, etc.
  images: [{ type: String }], // Array of Cloudinary URLs
  colors: [{ type: String }],
  sizes: [{ type: String }],
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }], // Comma separated tags mapped to array
  gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'], default: 'Unisex' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
