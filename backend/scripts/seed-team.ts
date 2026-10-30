import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import TeamMember from "../src/models/TeamMember";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const initialTeam = [
  {
    name: "Laxman Jadhav",
    role: "Founder & Lead Architect",
    department: "Leadership",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "Passionate about building scalable digital platforms, modern CRM solutions, and enterprise ERP architectures that transform businesses.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
      email: "connect@induxtechnology.com",
    },
    status: "Published",
    order: 1,
  },
  {
    name: "Shubham Kulkarni",
    role: "Full Stack Lead Developer",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Specializes in high-concurrency Node.js APIs, Next.js web applications, and mission-critical cloud deployments.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "connect@induxtechnology.com",
    },
    status: "Published",
    order: 2,
  },
  {
    name: "Pooja Deshmukh",
    role: "Senior UI/UX Designer",
    department: "Design",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bio: "Crafts intuitive user experiences, design systems, and beautiful product interfaces that delight clients.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "connect@induxtechnology.com",
    },
    status: "Published",
    order: 3,
  },
  {
    name: "Rohan Patil",
    role: "AI & Automation Engineer",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Focuses on intelligent conversational agents, workflow automation, and custom predictive models.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "connect@induxtechnology.com",
    },
    status: "Published",
    order: 4,
  },
];

async function seedTeam() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/indux";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const count = await TeamMember.countDocuments();
    if (count === 0) {
      console.log("No team members found. Seeding initial team members...");
      await TeamMember.insertMany(initialTeam);
      console.log(`Seeded ${initialTeam.length} team members successfully!`);
    } else {
      console.log(`Team collection already has ${count} members. Skipping seed.`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error seeding team members:", error);
    process.exit(1);
  }
}

seedTeam();
