import { Schema, model, models, Model } from "mongoose";
import type { Link } from "@/lib/db";

const linkSchema = new Schema({
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

// Collection pinned to "hashes" (nombre historico) para no perder datos existentes
const LinkModel =
  (models.Link as Model<Link>) || model<Link>("Link", linkSchema, "hashes");

export default LinkModel;
