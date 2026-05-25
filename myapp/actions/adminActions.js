'use server';
import dbConnect from '../lib/db';
import Product from '../models/Product';
import Appointment from '../models/Appointment';
import Order from '../models/Order';
import User from '../models/User';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { siteConfig } from '../app/config';

cloudinary.config({
  cloud_name: siteConfig.backend.cloudinary.cloudName,
  api_key: siteConfig.backend.cloudinary.apiKey,
  api_secret: siteConfig.backend.cloudinary.apiSecret,
});


// --- PRODUCT ACTIONS ---
export async function getProducts() {
  await dbConnect();
  return JSON.parse(JSON.stringify(await Product.find({}).sort({ createdAt: -1 })));
}

export async function addProduct(formData) {
  await dbConnect();
  
  const imageFiles = formData.getAll('imageFiles');
  const imageUrls = [];
  
  for (const imageFile of imageFiles) {
    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const url = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary Server Upload Error:', error);
                return reject(new Error('Cloudinary server-side upload failed: ' + error.message));
              }
              resolve(result.secure_url);
            }
          ).end(buffer);
        });
        imageUrls.push(url);
      } catch (err) {
        console.error('Cloudinary upload stream catch error:', err);
        throw new Error(err.message || 'Image upload failed on the server.');
      }
    }
  }
  
  const directImages = formData.get('images');
  const directUrls = directImages ? directImages.split(',').filter(Boolean) : [];
  const allImages = [...directUrls, ...imageUrls];
  
  const name = formData.get('name')?.trim();
  if (!name) throw new Error("Product name is required.");
  
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${escapedName}$`, 'i') } });
  if (existingProduct) {
    throw new Error(`A product with the name "${name}" already exists.`);
  }

  const price = parseFloat(formData.get('price'));
  if (isNaN(price) || price < 0) {
    throw new Error("Price cannot be negative.");
  }

  const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean) || [];
  const gender = formData.get('gender') || 'Unisex';

  const productData = {
    name: name,
    price: price,
    description: formData.get('description'),
    category: formData.get('category'),
    images: allImages,
    colors: formData.get('colors')?.split(',').map(c => c.trim()).filter(Boolean) || [],
    sizes: formData.get('sizes')?.split(',').map(s => s.trim()).filter(Boolean) || [],
    stock: parseInt(formData.get('stock')) || 0,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    tags: tags,
    gender: gender,
  };
  
  const product = await Product.create(productData);
  revalidatePath('/shop');
  revalidatePath('/admin');
  return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(id, formData) {
  await dbConnect();
  
  const imageFiles = formData.getAll('imageFiles');
  const newUploadedUrls = [];
  
  for (const imageFile of imageFiles) {
    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const url = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary Server Upload Error:', error);
                return reject(new Error('Cloudinary server-side upload failed: ' + error.message));
              }
              resolve(result.secure_url);
            }
          ).end(buffer);
        });
        newUploadedUrls.push(url);
      } catch (err) {
        console.error('Cloudinary upload stream catch error:', err);
        throw new Error(err.message || 'Image upload failed on the server.');
      }
    }
  }
  
  const keptImages = formData.getAll('existingImages');
  const allImages = [...keptImages, ...newUploadedUrls];
  
  const originalProduct = await Product.findById(id);
  if (originalProduct && originalProduct.images) {
    const deletedImages = originalProduct.images.filter(img => !keptImages.includes(img));
    for (const deletedImg of deletedImages) {
      const publicId = extractPublicId(deletedImg);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted Cloudinary image resource on product update: ${publicId}`);
        } catch (cloudinaryErr) {
          console.error('Cloudinary destroy image error during update:', cloudinaryErr);
        }
      }
    }
  }
  
  const name = formData.get('name')?.trim();
  if (!name) throw new Error("Product name is required.");
  
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, _id: { $ne: id } });
  if (existingProduct) {
    throw new Error(`A product with the name "${name}" already exists.`);
  }

  const price = parseFloat(formData.get('price'));
  if (isNaN(price) || price < 0) {
    throw new Error("Price cannot be negative.");
  }

  const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean) || [];
  const gender = formData.get('gender') || 'Unisex';

  const productData = {
    name: name,
    price: price,
    description: formData.get('description'),
    category: formData.get('category'),
    images: allImages,
    colors: formData.get('colors')?.split(',').map(c => c.trim()).filter(Boolean) || [],
    sizes: formData.get('sizes')?.split(',').map(s => s.trim()).filter(Boolean) || [],
    stock: parseInt(formData.get('stock')) || 0,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    tags: tags,
    gender: gender,
  };
  
  const product = await Product.findByIdAndUpdate(id, productData, { new: true });
  revalidatePath('/shop');
  revalidatePath('/admin');
  return JSON.parse(JSON.stringify(product));
}


function extractPublicId(url) {
  try {
    const parts = url.split('/image/upload/');
    if (parts.length < 2) return null;
    
    const pathAndFilename = parts[1];
    const pathParts = pathAndFilename.split('/');
    if (pathParts[0].startsWith('v')) {
      pathParts.shift(); // Remove version part like 'v1716309600'
    }
    
    const remainingPath = pathParts.join('/');
    const lastDotIdx = remainingPath.lastIndexOf('.');
    if (lastDotIdx === -1) {
      return remainingPath;
    }
    return remainingPath.substring(0, lastDotIdx);
  } catch (err) {
    console.error('Error extracting Cloudinary public ID:', err);
    return null;
  }
}

export async function deleteProduct(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id);
    if (product && product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary image resource: ${publicId}`);
          } catch (cloudinaryErr) {
            console.error('Cloudinary destroy image error:', cloudinaryErr);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error locating product images for deletion:', err);
  }

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

export async function deleteAppointment(id) {
  await dbConnect();
  await Appointment.findByIdAndDelete(id);
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

export async function getProductById(id) {
  await dbConnect();
  try {
    const product = await Product.findById(id);
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (err) {
    console.error("Error in getProductById server action:", err);
    return null;
  }
}

export async function verifyAdminCredentials(username, password) {
  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Invalid username or password' };
    }
    return { success: true, name: user.name };
  } catch (error) {
    console.error('Database connection error during admin verification:', error);
    return { success: false, error: 'Database connection failed. Please ensure MongoDB is running and reachable.' };
  }
}
