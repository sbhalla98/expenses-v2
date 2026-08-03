import { COLLECTIONS, DB_NAME, HEADERS } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = request.headers.get(HEADERS.USER_ID) || "test-id";

    // Clean existing assets and snapshots
    await db.collection(COLLECTIONS.NET_WORTH_ASSETS).deleteMany({ userId });
    await db.collection(COLLECTIONS.NET_WORTH_SNAPSHOTS).deleteMany({ userId });

    const assets = [
      { id: "asset-stocks-kite", name: "Stocks @ kite", category: "equity", trackingType: "value", owner: "PERSON1", notes: "Kite app, auto-sync value" },
      { id: "asset-mf-coin", name: "Mutual Fund @ coin", category: "mutual_funds", trackingType: "value", owner: "PERSON2", notes: "Zerodha Coin, joint bank link" },
      { id: "asset-mf-dezerv", name: "Mutual Fund @ dezerv", category: "mutual_funds", trackingType: "value", owner: "PERSON2", notes: "Dezerv wealth management app" },
      {
        id: "asset-fd-hdfc",
        name: "Fixed deposit @ HDFC",
        category: "fixed_deposit",
        trackingType: "fd",
        principal: 60000,
        interestRate: 7.0,
        startDate: "2025-01-01T00:00:00.000Z",
        maturityDate: "2029-01-01T00:00:00.000Z",
        owner: "Both",
        notes: "FD receipt no. 908127391823",
      },
      {
        id: "asset-fd-axis",
        name: "Fixed deposit @ AXIS",
        category: "fixed_deposit",
        trackingType: "fd",
        principal: 100000,
        interestRate: 7.0,
        startDate: "2026-06-01T00:00:00.000Z",
        maturityDate: "2029-06-01T00:00:00.000Z",
        owner: "Both",
        notes: "AXIS NetBanking lock-in period",
      },
      { id: "asset-rsu-uber", name: "RSU @ uber", category: "equity", trackingType: "value", owner: "PERSON1", notes: "Schwab equity account" },
      { id: "asset-gold", name: "Gold ornaments", category: "gold", trackingType: "quantity", quantity: 96, unitLabel: "grams", owner: "Both", notes: "Stored in home locker" },
      { id: "asset-diamond", name: "Diamond ornaments", category: "other", trackingType: "value", owner: "PERSON2", notes: "Safe box at HDFC bank" },
      { id: "asset-nps", name: "NPS @ protean", category: "retirement", trackingType: "value", owner: "PERSON1", notes: "Retirement account, PRAN number 1100..." },
      { id: "asset-epf-mx", name: "EPF @ marketxpander", category: "retirement", trackingType: "value", owner: "PERSON1", notes: "MarketXpander EPF portal" },
      { id: "asset-epf-mohalla", name: "EPF @ mohalla tech", category: "retirement", trackingType: "value", owner: "PERSON1", notes: "Mohalla Tech EPF portal" },
      { id: "asset-epf-uber", name: "EPF @ uber", category: "retirement", trackingType: "value", owner: "PERSON1", notes: "Uber India EPF trust portal" },
      { id: "asset-car", name: "Car @ brezza", category: "vehicles", trackingType: "value", owner: "Both", notes: "Vehicle registration DL3C..." },
      { id: "asset-cash", name: "Cash in hand", category: "saving", trackingType: "Both", notes: "Physical cash in wardrobe dresser" },
    ].map((asset) => ({
      ...asset,
      userId,
      createdAt: new Date().toISOString(),
    }));

    await db.collection(COLLECTIONS.NET_WORTH_ASSETS).insertMany(assets);

    const snapshots = [
      {
        id: "snap-2025-08-01",
        date: "2025-08-01",
        goldPricePerGram: 7000,
        values: {
          "asset-stocks-kite": 407000,
          "asset-mf-coin": 184000,
          "asset-mf-dezerv": 226000,
          "asset-fd-hdfc": 65000,
          "asset-fd-axis": 0,
          "asset-rsu-uber": 500000,
          "asset-gold": 0,
          "asset-diamond": 0,
          "asset-nps": 93000,
          "asset-epf-mx": 99000,
          "asset-epf-mohalla": 20000,
          "asset-epf-uber": 300000,
          "asset-car": 900000,
          "asset-cash": 10000,
        },
        unitPrices: {
          "asset-gold": 7000,
        },
      },
      {
        id: "snap-2025-11-01",
        date: "2025-11-01",
        goldPricePerGram: 7000,
        values: {
          "asset-stocks-kite": 431000,
          "asset-mf-coin": 191000,
          "asset-mf-dezerv": 234000,
          "asset-fd-hdfc": 65000,
          "asset-fd-axis": 0,
          "asset-rsu-uber": 741000,
          "asset-gold": 0,
          "asset-diamond": 0,
          "asset-nps": 98000,
          "asset-epf-mx": 99000,
          "asset-epf-mohalla": 20000,
          "asset-epf-uber": 552000,
          "asset-car": 900000,
          "asset-cash": 10000,
        },
        unitPrices: {
          "asset-gold": 7000,
        },
      },
      {
        id: "snap-2026-02-01",
        date: "2026-02-01",
        goldPricePerGram: 7000,
        values: {
          "asset-stocks-kite": 231000,
          "asset-mf-coin": 72000,
          "asset-mf-dezerv": 224000,
          "asset-fd-hdfc": 65000,
          "asset-fd-axis": 0,
          "asset-rsu-uber": 1152000,
          "asset-gold": 672000,
          "asset-diamond": 70000,
          "asset-nps": 98000,
          "asset-epf-mx": 99000,
          "asset-epf-mohalla": 20000,
          "asset-epf-uber": 697000,
          "asset-car": 800000,
          "asset-cash": 10000,
        },
        unitPrices: {
          "asset-gold": 7000,
        },
      },
      {
        id: "snap-2026-05-01",
        date: "2026-05-01",
        goldPricePerGram: 7000,
        values: {
          "asset-stocks-kite": 291000,
          "asset-mf-coin": 285000,
          "asset-mf-dezerv": 223000,
          "asset-fd-hdfc": 65000,
          "asset-fd-axis": 0,
          "asset-rsu-uber": 1412000,
          "asset-gold": 672000,
          "asset-diamond": 70000,
          "asset-nps": 98000,
          "asset-epf-mx": 99000,
          "asset-epf-mohalla": 20000,
          "asset-epf-uber": 842000,
          "asset-car": 800000,
          "asset-cash": 470000,
        },
        unitPrices: {
          "asset-gold": 7000,
        },
      },
      {
        id: "snap-2026-08-01",
        date: "2026-08-01",
        goldPricePerGram: 7000,
        values: {
          "asset-stocks-kite": 270000,
          "asset-mf-coin": 286000,
          "asset-mf-dezerv": 225000,
          "asset-fd-hdfc": 65000,
          "asset-fd-axis": 100000,
          "asset-rsu-uber": 2112000,
          "asset-gold": 672000,
          "asset-diamond": 70000,
          "asset-nps": 98000,
          "asset-epf-mx": 99000,
          "asset-epf-mohalla": 20000,
          "asset-epf-uber": 842000,
          "asset-car": 800000,
          "asset-cash": 730000,
        },
        unitPrices: {
          "asset-gold": 7000,
        },
      },
    ].map((snap) => ({
      ...snap,
      userId,
      createdAt: new Date().toISOString(),
    }));

    await db.collection(COLLECTIONS.NET_WORTH_SNAPSHOTS).insertMany(snapshots);

    return NextResponse.json({
      success: true,
      message: "Net worth data seeded with owners and notes successfully",
    });
  } catch (e) {
    console.error("Error seeding net worth data:", e);
    return NextResponse.json(
      { success: false, message: "Error seeding data" },
      { status: 500 },
    );
  }
}
