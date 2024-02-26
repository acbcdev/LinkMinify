import { connectDB } from "@/lib/mongodb";
import Hash from "@/models/hash";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
// export async function GET(hash: string) {
//   await connectDB();

//   const result = await Hash.findOne({ hash });
//   return NextResponse.json(result);
// }
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  await connectDB();
  const slung = params.code;

  const result = await Hash.find({
    code: slung,
  });

  // redirect(result[0].url);
  return NextResponse.json(result);
}
