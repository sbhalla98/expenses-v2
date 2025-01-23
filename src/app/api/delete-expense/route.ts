import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");
    const userId = request.headers.get("user-id");

    const { id } = body;
    const data = await collection.deleteOne({ id, userId });

    if (data.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error deleting expense", details: e },
      { status: 500 },
    );
  }
}
