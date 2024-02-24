import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost/nextmongo";
export async function connectDB() {
  await mongoose.connect(MONGODB_URL);
}
