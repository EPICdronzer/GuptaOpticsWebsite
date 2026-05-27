import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  date: { type: Date, required: true },
  location: { type: String, enum: ['home', 'shop'], default: 'shop' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  whatsappSent: { type: Boolean, default: true },
  notes: { type: String },
}, { timestamps: true });

// Force clear cached model in development to prevent Mongoose schema hot-reload cache bugs
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  delete mongoose.models.Appointment;
}

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
