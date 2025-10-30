"use server";

import { nanoid } from "nanoid";
import { connectDB } from "@/lib/mongodb";
import { randomNum } from "@/lib/utils";
import Hash from "@/models/hash";

export async function GetUrl(hash: string) {
  "use server";
  await connectDB();
  const result = await Hash.findOne({ code: hash });
  return result.url;
}
export async function CreateUrl(url: string) {
  "use server";
  try {
    await connectDB();
    let urlToShort = url;
    if (!/^(https?:\/\/)/.test(url)) {
      urlToShort = `https://${url}`;
    }
    const result = await Hash.create({
      url: urlToShort,
      code: nanoid(randomNum()),
    });
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error });
  }
}

export async function DeleteUrl(code: string) {
  "use server";
  try {
    await connectDB();
    const result = await Hash.deleteOne({ code });
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error });
  }
}
