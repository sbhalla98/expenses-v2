import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.RECURRING_EXPENSES);

    const userId = request.headers.get(HEADERS.USER_ID);
    const query = userId ? { userId } : {};

    const recurringExpenses = await collection.find(query).toArray();

    return NextResponse.json({ success: true, data: recurringExpenses });
  } catch (e) {
    console.error("Error fetching recurring expenses:", e);
    return NextResponse.json(
      { success: false, message: "Error fetching recurring expenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.RECURRING_EXPENSES);
    const id = uuidv4();
    const userId = request.headers.get(HEADERS.USER_ID);

    const recurringExpense = { ...body, id, userId };
    await collection.insertOne(recurringExpense);

    return NextResponse.json({ success: true, data: recurringExpense });
  } catch (e) {
    console.error("Error creating recurring expense:", e);
    return NextResponse.json(
      { success: false, message: "Error creating recurring expense" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.RECURRING_EXPENSES);

    await collection.updateOne({ id }, { $set: updateData });

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (e) {
    console.error("Error updating recurring expense:", e);
    return NextResponse.json(
      { success: false, message: "Error updating recurring expense" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.RECURRING_EXPENSES);

    await collection.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting recurring expense:", e);
    return NextResponse.json(
      { success: false, message: "Error deleting recurring expense" },
      { status: 500 },
    );
  }
}
