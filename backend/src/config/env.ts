import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
  CLIENT_URL: string;
  ADMIN_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: required("MONGO_URI"),
  CLIENT_URL: process.env.CLIENT_URL || "",
  ADMIN_URL: process.env.ADMIN_URL || "",

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};