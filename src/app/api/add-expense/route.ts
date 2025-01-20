import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const data = await request.json();
  console.log("request", request, data);
  return NextResponse.json({ message: "Hello, World!" });
}
