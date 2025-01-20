import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const id = uuidv4();
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");

    const result = await collection.insertOne({ ...body, id });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { message: "Error adding expense" },
      { status: 500 }
    );
  }
}
