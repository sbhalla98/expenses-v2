import clientPromise from "@/lib/mongodb";
import { Expense } from "@/store/use-config-store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const userId = request.headers.get("user-id");

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
    const db = client.db("expenses-v2");
    const collection = db.collection("expenses");

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
