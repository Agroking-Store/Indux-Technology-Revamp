const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const Blog = require("./dist/models/Blog").default;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/indux";

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB!");
  
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(15);
  console.log("Found", blogs.length, "recent blogs:");
  blogs.forEach(b => {
    console.log("-----------------------------------------");
    console.log("Blog ID:", b._id);
    console.log("Title:", b.title);
    console.log("Status:", b.status);
    console.log("FeaturedImage type:", typeof b.featuredImage);
    if (b.featuredImage) {
      console.log("FeaturedImage length:", b.featuredImage.length);
      console.log("FeaturedImage prefix:", b.featuredImage.substring(0, 100));
    } else {
      console.log("FeaturedImage is empty/null");
    }
  });
  
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
