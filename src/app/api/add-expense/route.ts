import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");

    const result = await collection.insertOne(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { message: "Error adding expense" },
      { status: 500 }
    );
  }
}
