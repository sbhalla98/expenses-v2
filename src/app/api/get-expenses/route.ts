import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.EXPENSES);
    const userId = request.headers.get(HEADERS.USER_ID);
    const data = await collection.find({ userId }).toArray();

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error fetching expense list!", details: e },
      { status: 500 },
    );
  }
}
