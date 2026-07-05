import { connectDB } from "@/lib/mongodb";
import { generateCode } from "@/lib/utils";
import LinkModel from "@/models/link";

export interface Link {
  code: string;
  url: string;
  clicked: number;
  createdAt: Date;
}

export interface LinkRepository {
  create(url: string): Promise<Link>;

  /** Incrementa clicks y devuelve el link. null si no existe. */
  trackClick(code: string): Promise<Link | null>;

  deleteByCode(code: string): Promise<number>;
}

const MAX_RETRIES = 5;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

async function createWithUniqueCode(url: string, attempt = 1): Promise<Link> {
  try {
    return await LinkModel.create({ url, code: generateCode() });
  } catch (err) {
    if (!isDuplicateKeyError(err)) throw err; // otro error → NO te lo tragues
    if (attempt >= MAX_RETRIES) {
      throw new Error(
        `Failed to generate unique code after ${MAX_RETRIES} attempts`,
      );
    }
    return createWithUniqueCode(url, attempt + 1); // colisión → reintenta
  }
}

class MongoLinkRepository implements LinkRepository {
  async create(url: string): Promise<Link> {
    await connectDB();
    return createWithUniqueCode(url);
  }

  async trackClick(code: string): Promise<Link | null> {
    await connectDB();
    return LinkModel.findOneAndUpdate({ code }, { $inc: { clicked: 1 } });
  }

  async deleteByCode(code: string): Promise<number> {
    await connectDB();
    const result = await LinkModel.deleteOne({ code });
    return result.deletedCount;
  }
}

export const linkRepository: LinkRepository = new MongoLinkRepository();
