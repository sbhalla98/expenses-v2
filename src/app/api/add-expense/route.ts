import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");
    const id = uuidv4();
    const userId = request.headers.get("user-id");

    const data = await collection.insertOne({ ...body, id, userId });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error adding expense", details: e },
      { status: 500 }
    );
  }
}
