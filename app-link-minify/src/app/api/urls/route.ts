import { connectDB } from "@/lib/mongodb";
import Hash from "@/models/hash";

import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const result = await Hash.find();
  return NextResponse.json(result);
}
export async function POST(request: Request) {
  await connectDB();
  const res = await request.json();
  const result = await Hash.create({
    url: res.url ?? "localhost:8080",
    code: res.code,
  });
  return NextResponse.json(result);
}
