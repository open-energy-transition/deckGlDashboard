import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Hello World!", req);
  return NextResponse.json({ message: "Hello World!" });
}
