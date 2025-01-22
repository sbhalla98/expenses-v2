"use client";

import { sample } from "@/lib/constants";
import CategoryStats from "./components/category-stats";
import PaidByStats from "./components/paid-by-stats";
import PaidForStats from "./components/paid-for-stats";

export default function Statistics() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 p-6">Statistics</h1>
      <CategoryStats expenses={sample} />
      <PaidByStats expenses={sample} />
      <PaidForStats expenses={sample} />
    </div>
  );
}
