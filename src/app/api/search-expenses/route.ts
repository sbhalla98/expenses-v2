import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { Expense } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const userId = request.headers.get(HEADERS.USER_ID);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    if (!query) {
      return NextResponse.json({ success: true, data: [] });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.EXPENSES);

    const expenses = await collection
      .find({
        userId,
        $or: [
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    // Sort by date descending (latest first)
    const sortedExpenses = (expenses as unknown as Expense[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json({ success: true, data: sortedExpenses });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error searching expenses", error: e },
      { status: 500 },
    );
  }
}
