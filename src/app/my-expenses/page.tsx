"use client";

import ExpenseList from "./components/expense-list";
import { sample } from "./constants";

export default function MyExpenses() {
  return <ExpenseList expenses={sample} />;
}
