import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin';
import dns from 'dns'

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const updateAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const adminEmail = 'shailjaiswal9135@gmail.com';
    const newPassword = 'password123'; // Change to any password you want

    // Generate a fresh hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the admin's password
    const result = await Admin.findOneAndUpdate(
      { email: adminEmail },
      { password: hashedPassword },
      { new: true }
    );

    if (result) {
      console.log(`✅ Admin password updated for ${adminEmail}`);
      console.log(`🔑 New password: ${newPassword}`);
    } else {
      console.log(`❌ Admin not found with email ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
};

updateAdminPassword();