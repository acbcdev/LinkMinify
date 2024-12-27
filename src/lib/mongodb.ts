import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost/nextmongo";
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URL);
  } catch {
    console.error("Error connecting to the database");
  }
}
