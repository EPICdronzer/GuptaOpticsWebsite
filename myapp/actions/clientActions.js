'use server';
import dbConnect from '../lib/db';
import Appointment from '../models/Appointment';
import Order from '../models/Order';

export async function createAppointment(data) {
  await dbConnect();
  try {
    const appointment = await Appointment.create({
      name: data.name,
      date: new Date(data.date),
      whatsappSent: true
    });
    return { success: true, id: appointment._id.toString() };
  } catch (error) {
    console.error('Appointment creation error:', error);
    return { success: false, error: 'Failed to save appointment' };
  }
}

export async function createOrder(data) {
  await dbConnect();
  try {
    const order = await Order.create({
      customerName: data.name,
      customerPhone: data.phone,
      items: data.items,
      totalAmount: data.totalAmount,
      whatsappRedirected: true
    });
    return { success: true, id: order._id.toString() };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: 'Failed to save order' };
  }
}
