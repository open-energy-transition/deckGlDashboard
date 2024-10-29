import { NextResponse } from "next/server";

export const GET = async (req) => {
  console.log("Hello World!", req);
  return NextResponse.json({ message: "Hello World!" });
};
