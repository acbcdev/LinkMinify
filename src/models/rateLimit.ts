import { model, models, Schema } from "mongoose";

const RateLimitSchema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 172800, // Auto-delete after 2 days (in seconds)
  },
});

// Compound index for efficient queries
RateLimitSchema.index({ ip: 1, date: 1 }, { unique: true });

const RateLimit = models.RateLimit || model("RateLimit", RateLimitSchema);

export default RateLimit;
