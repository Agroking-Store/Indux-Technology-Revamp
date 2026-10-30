import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import TeamMember from "../src/models/TeamMember";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const initialTeam = [
  {
    name: "Laxman Jadhav",
    role: "Founder & Chief Technology Officer",
    department: "Leadership",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "Pioneering enterprise architectures, distributed cloud systems, and strategic technology direction at Indux Technology.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "contact@induxtechnology.com",
    },
    status: "Published",
    order: 1,
  },
  {
    name: "Shubham Kulkarni",
    role: "Lead Full-Stack Architect",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Specializing in resilient microservices, high-performance web applications, and real-time backend pipelines.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "contact@induxtechnology.com",
    },
    status: "Published",
    order: 2,
  },
  {
    name: "Pooja Deshmukh",
    role: "Lead UI/UX & Design Systems",
    department: "Design",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bio: "Crafting modern, accessible user interfaces and intuitive design systems that delight clients and scale effortlessly.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "contact@induxtechnology.com",
    },
    status: "Published",
    order: 3,
  },
  {
    name: "Rohan Patil",
    role: "Senior AI & Automation Engineer",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Building autonomous workflow automations, intelligent LLM integrations, and custom ERP business logic.",
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "contact@induxtechnology.com",
    },
    status: "Published",
    order: 4,
  },
];

async function seedTeam() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/indux";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    // Remove existing team members and reseed exactly the team data
    const deleted = await TeamMember.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing team member record(s).`);

    const inserted = await TeamMember.insertMany(initialTeam);
    console.log(`Successfully seeded ${inserted.length} team members into current MongoDB database!`);

    for (const member of inserted) {
      console.log(` - [${member.status}] ${member.name} (${member.role})`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error seeding team members:", error);
    process.exit(1);
  }
}

seedTeam();
