'use server'

import { connectDB } from "@/lib/mongodb";
import { randomNum } from "@/lib/utils";
import Hash from "@/models/hash";
import { nanoid } from "nanoid";

export async function GetUrl(hash: string) {
  'use server'
  await connectDB();
  const result = await Hash.findOne({ code: hash });
  return result.url
}
export async function CreateUrl(url: string) {
  'use server'
  await connectDB();
  const result = await Hash.create({
    url: url,
    code: nanoid(randomNum()),
  });
  return JSON.stringify(result);
}