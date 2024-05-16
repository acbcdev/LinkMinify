'use server'

import { connectDB } from "@/lib/mongodb";
import Hash from "@/models/hash";
import { nanoid } from "nanoid";

export async function GetUrl(hash: string) {
  await connectDB();
  const result = await Hash.findOne({ code: hash });
  return result.url;
}
export async function CreateUrl(url: string) {
  await connectDB();
  const result = await Hash.create({
    url: url,
    code: nanoid(7),
  });
  return result;
}