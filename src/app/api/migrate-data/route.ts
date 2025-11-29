import { DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { Expense } from "@/lib/types";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const client = await clientPromise;

    const db = client.db(DB_NAME);
    const collection = db.collection("expenses2");
    const id = uuidv4();
    const userId = request.headers.get(HEADERS.USER_ID) || "test-id";

    const reqBody = body.map((item: Expense) => {
      return { ...item, id: uuidv4(), userId };
    });

    const data = await collection.insertMany(reqBody);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Error adding expense", details: e },
      { status: 500 },
    );
  }
}
