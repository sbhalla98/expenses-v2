import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.NET_WORTH_ASSETS);

    const userId = request.headers.get(HEADERS.USER_ID);
    const query = userId ? { userId } : {};

    const assets = await collection.find(query).toArray();

    return NextResponse.json({ success: true, data: assets });
  } catch (e) {
    console.error("Error fetching assets:", e);
    return NextResponse.json(
      { success: false, message: "Error fetching assets" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.NET_WORTH_ASSETS);
    const id = uuidv4();
    const userId = request.headers.get(HEADERS.USER_ID);

    const asset = {
      ...body,
      id,
      userId,
      createdAt: new Date().toISOString(),
    };
    await collection.insertOne(asset);

    return NextResponse.json({ success: true, data: asset });
  } catch (e) {
    console.error("Error creating asset:", e);
    return NextResponse.json(
      { success: false, message: "Error creating asset" },
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
    const collection = db.collection(COLLECTIONS.NET_WORTH_ASSETS);

    await collection.updateOne({ id }, { $set: updateData });

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (e) {
    console.error("Error updating asset:", e);
    return NextResponse.json(
      { success: false, message: "Error updating asset" },
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
    const collection = db.collection(COLLECTIONS.NET_WORTH_ASSETS);

    await collection.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting asset:", e);
    return NextResponse.json(
      { success: false, message: "Error deleting asset" },
      { status: 500 },
    );
  }
}
