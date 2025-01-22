import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");
    const userId = request.headers.get("user-id");
    const data = await collection.find({ userId }).toArray();

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error fetching expense list!", details: e },
      { status: 500 },
    );
  }
}
