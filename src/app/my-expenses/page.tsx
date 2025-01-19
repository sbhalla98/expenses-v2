"use client";

import GroupedExpenseList from "./components/grouped-expense-list";
import { sample } from "./constants";

export default function MyExpenses() {
  return <GroupedExpenseList expenses={sample} groupKey="date" />;
}
