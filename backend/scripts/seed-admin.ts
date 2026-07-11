// backend/scripts/seed-admin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin'; // adjust path if needed
import dns from 'dns'
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const adminEmail = 'test@example.com';
    const adminPassword = 'password123';

    // Check if admin already exists
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists. Skipping seed.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    await Admin.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
    });

    console.log(`Admin created with email: ${adminEmail} and password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();