import mongoose from "mongoose";

const { Schema } = mongoose;

const hashSchema = new Schema({
  id: Number,
  url: String,
  hash: String,
  created_at: Date,
});
const Hash = mongoose.model("Hash", hashSchema);

export default Hash;
