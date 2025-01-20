import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");

    const data = await collection.find({}).toArray();

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { message: "Error adding expense" },
      { status: 500 }
    );
  }
}
