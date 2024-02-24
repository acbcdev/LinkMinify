import { connectDB } from "@/lib/mongodb";
import Hash from "@/models/hash";
import { NextResponse } from "next/server";
// export async function GET(hash: string) {
//   await connectDB();

//   const result = await Hash.findOne({ hash });
//   return NextResponse.json(result);
// }
export async function GET() {
  await connectDB();

  const result = await Hash.find();
  return NextResponse.json(result);
}
