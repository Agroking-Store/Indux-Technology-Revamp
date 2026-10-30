import mongoose from "mongoose";
import dns from "dns";
import { env } from "./env";

const connectDB = async (): Promise<void> => {
  const uri = env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err: any) {
    if (err?.code === "ETIMEOUT" || err?.syscall === "querySrv") {
      console.log("System DNS SRV resolution timed out. Trying alternative DNS (1.1.1.1, 8.8.8.8)...");
      try {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return;
      } catch (err2: any) {
        console.log("SRV DNS still failing. Connecting via direct MongoDB cluster shard hosts...");
        const directUri = uri
          .replace("mongodb+srv://", "mongodb://")
          .replace(
            "@cluster0.mvvnttf.mongodb.net",
            "@ac-y0lujk9-shard-00-00.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-01.mvvnttf.mongodb.net:27017,ac-y0lujk9-shard-00-02.mvvnttf.mongodb.net:27017"
          ) + (uri.includes("?") ? "&ssl=true&authSource=admin" : "?ssl=true&authSource=admin");

        const conn = await mongoose.connect(directUri, { serverSelectionTimeoutMS: 12000 });
        console.log(`MongoDB connected (direct fallback): ${conn.connection.host}`);
        return;
      }
    }

    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
