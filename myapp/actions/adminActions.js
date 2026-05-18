'use server';
import dbConnect from '../lib/db';
import Product from '../models/Product';
import Appointment from '../models/Appointment';
import Order from '../models/Order';
import { revalidatePath } from 'next/cache';

// --- PRODUCT ACTIONS ---
export async function getProducts() {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Product.find({}).sort({ createdAt: -1 })));
}

export async function addProduct(formData) {
  await dbConnect();
  const productData = {
    name: formData.get('name'),
    price: parseFloat(formData.get('price')),
    description: formData.get('description'),
    category: formData.get('category'),
    images: formData.get('images').split(','), // Expecting comma separated URLs from Cloudinary
    colors: formData.get('colors')?.split(',') || [],
    sizes: formData.get('sizes')?.split(',') || [],
    stock: parseInt(formData.get('stock')) || 0,
    isFeatured: formData.get('isFeatured') === 'on',
  };
  
  const product = await Product.create(productData);
  revalidatePath('/shop');
  revalidatePath('/admin');
  return JSON.parse(JSON.stringify(product));
}

export async function deleteProduct(id) {
  await dbConnect();
  await Product.findByIdAndDelete(id);
  revalidatePath('/shop');
  revalidatePath('/admin');
}

// --- APPOINTMENT ACTIONS ---
export async function getAppointments() {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Appointment.find({}).sort({ date: 1 })));
}

export async function updateAppointmentStatus(id, status) {
  await dbConnect();
  await Appointment.findByIdAndUpdate(id, { status });
  revalidatePath('/admin');
}

// --- ORDER ACTIONS ---
export async function getOrders() {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Order.find({}).sort({ createdAt: -1 })));
}

export async function updateOrderStatus(id, status) {
  await dbConnect();
  await Order.findByIdAndUpdate(id, { status });
  revalidatePath('/admin');
}
