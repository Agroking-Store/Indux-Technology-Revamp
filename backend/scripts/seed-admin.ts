// backend/scripts/seed-admin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Admin from "../src/models/Admin";

dotenv.config();

const connectMongo = async (uri: string) => {
  // 1. Try default system DNS
  try {
    return await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
  } catch (err: any) {
    if (err?.code === "ETIMEOUT" || err?.syscall === "querySrv") {
      console.log("System DNS SRV resolution timed out. Trying alternative DNS (1.1.1.1, 8.8.8.8)...");
      try {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
        return await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
      } catch (err2: any) {
        console.log("SRV DNS still failing. Connecting via direct MongoDB cluster shard hosts...");
        const directUri = uri
          .replace("mongodb+srv://", "mongodb://")
          .replace(
            "@cluster0.mvvnttf.mongodb.net",
            "@ac-y0lujk9-shard-00-00.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-01.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-02.mvvnttf.mongodb.net:27017"
          ) + (uri.includes("?") ? "&ssl=true&authSource=admin" : "?ssl=true&authSource=admin");

        return await mongoose.connect(directUri, { serverSelectionTimeoutMS: 10000 });
      }
    }
    throw err;
  }
};

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI!;
    console.log("Connecting to MongoDB...");
    await connectMongo(uri);
    console.log("Connected to MongoDB successfully!");

    const adminEmail = "shailjaiswal9135@gmail.com";
    const adminPassword = "password123";

    // Check if admin already exists
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin account (${adminEmail}) already exists. Ready to log in!`);
      process.exit(0);
    }

    // Create admin
    await Admin.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
    });

    console.log(`✅ Admin created with email: ${adminEmail} and password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
