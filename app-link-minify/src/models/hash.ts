import { Schema, model, models } from "mongoose";
import nanoid from "nanoid";

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
  },
});
const Hash = models.Hash || model("Hash", hashSchema);

export default Hash;
