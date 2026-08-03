import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.NET_WORTH_SNAPSHOTS);

    const userId = request.headers.get(HEADERS.USER_ID);
    const query = userId ? { userId } : {};

    // Sort by date ascending for chronological order
    const snapshots = await collection.find(query).sort({ date: 1 }).toArray();

    return NextResponse.json({ success: true, data: snapshots });
  } catch (e) {
    console.error("Error fetching snapshots:", e);
    return NextResponse.json(
      { success: false, message: "Error fetching snapshots" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.NET_WORTH_SNAPSHOTS);
    const userId = request.headers.get(HEADERS.USER_ID);

    const { date, goldPricePerGram, values, unitPrices, quantities } = body;

    if (!date || !values) {
      return NextResponse.json(
        { success: false, message: "Date and values are required" },
        { status: 400 },
      );
    }

    const query = { userId, date };
    const existing = await collection.findOne(query);

    if (existing) {
      await collection.updateOne(
        { id: existing.id },
        { $set: { goldPricePerGram, values, unitPrices, quantities } },
      );
      return NextResponse.json({
        success: true,
        data: { ...existing, goldPricePerGram, values, unitPrices, quantities },
      });
    } else {
      const id = uuidv4();
      const snapshot = {
        id,
        userId,
        date,
        goldPricePerGram,
        values,
        unitPrices,
        quantities,
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(snapshot);
      return NextResponse.json({ success: true, data: snapshot });
    }
  } catch (e) {
    console.error("Error saving snapshot:", e);
    return NextResponse.json(
      { success: false, message: "Error saving snapshot" },
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
    const collection = db.collection(COLLECTIONS.NET_WORTH_SNAPSHOTS);

    await collection.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting snapshot:", e);
    return NextResponse.json(
      { success: false, message: "Error deleting snapshot" },
      { status: 500 },
    );
  }
}
