export const DB_NAME = "expenses-v2";

export const COLLECTIONS = {
  EXPENSES: "expenses",
  RECURRING_EXPENSES: "recurring-expenses",
  NET_WORTH_ASSETS: "net-worth-assets",
  NET_WORTH_SNAPSHOTS: "net-worth-snapshots",
} as const;

export const HEADERS = {
  USER_ID: "user-id",
} as const;
