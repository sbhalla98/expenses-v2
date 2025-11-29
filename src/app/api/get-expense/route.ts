import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.EXPENSES);
    const userId = request.headers.get(HEADERS.USER_ID);
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const data = await collection.findOne({ id, userId });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error fetching expense", details: e },
      { status: 500 },
    );
  }
}
