import { Schema, model, models, Model } from "mongoose";
import type { Link } from "@/lib/db";

const hashSchema = new Schema({
  code: {
    type: String,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  clicked: { type: Number, default: 0 },
  created_at: {
    type: Date,
    default: Date.now,
    alias: "createdAt", // DB guarda created_at, dominio lo lee como createdAt
  },
});

const Hash = (models.Hash as Model<Link>) || model<Link>("Hash", hashSchema);

export default Hash;
