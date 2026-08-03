import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.EXPENSES);
    const userId = request.headers.get(HEADERS.USER_ID);

    const { ids, updates } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or empty expense ids" },
        { status: 400 },
      );
    }

    const result = await collection.updateMany(
      { id: { $in: ids }, userId },
      { $set: updates },
    );

    return NextResponse.json({ success: true, result });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error bulk updating expenses", details: e },
      { status: 500 },
    );
  }
}
