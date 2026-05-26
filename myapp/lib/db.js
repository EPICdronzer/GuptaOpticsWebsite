import mongoose from 'mongoose';
import dns from 'dns';
import { siteConfig } from '../app/config';
import { adminSetup } from '../app/adminSetup';
import User from '../models/User';

// Override Node's dns resolution for MongoDB Atlas SRV query issues on Windows
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Failed to configure custom DNS servers:', err);
  }
}

const MONGODB_URI = process.env.MONGODB_URI || siteConfig.backend.mongodbUri;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable or mongodbUri property in config.js');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'optical', // Explicitly direct all models to the 'optical' database instead of default 'test'
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      cached.promise = null; // Clear cached promise on failure so next request can retry
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    
    // --- AUTOMATIC DATABASE SEEDER ---
    // Since there's no registration page, we seed/sync the admin user dynamically here
    try {
      const adminExists = await User.findOne({ username: adminSetup.username });
      
      if (!adminExists) {
        await User.create({
          username: adminSetup.username,
          password: adminSetup.password,
          name: adminSetup.name,
        });
        console.log(`\x1b[32m[DB SEED] Successfully created default admin user: ${adminSetup.username}\x1b[0m`);
      } else {
        // Keep DB record in sync if credentials are edited in adminSetup.js
        if (adminExists.password !== adminSetup.password || adminExists.name !== adminSetup.name) {
          adminExists.password = adminSetup.password;
          adminExists.name = adminSetup.name;
          await adminExists.save();
          console.log(`\x1b[36m[DB SEED] Synced admin credentials inside MongoDB with adminSetup.js!\x1b[0m`);
        }
      }
    } catch (seedErr) {
      console.error('[DB SEED] Failed to seed/sync admin user:', seedErr);
    }
    
  } catch (err) {
    cached.promise = null; // Reset on error
    throw err;
  }
  
  return cached.conn;
}

export default dbConnect;
