// backend/scripts/seed-admin.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin'; // adjust path if needed
import dns from 'dns'
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const adminEmail = 'shailjaiswal9135@gmail.com';
    const adminPassword = 'password123';

    // Check if admin already exists
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin (Mongoose pre-save hook will hash this password automatically)
    await Admin.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
    });

    console.log(`Admin created with email: ${adminEmail} and password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();