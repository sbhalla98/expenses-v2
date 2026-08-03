import { NetWorthAsset } from "../types";

export const ASSET_CATEGORY_ORDER: Record<string, number> = {
  saving: 1,
  fixed_deposit: 2,
  mutual_funds: 3,
  equity: 4,
  retirement: 5,
  gold: 6,
  property: 7,
  vehicles: 8,
  other: 9,
};

export const OWNER_ORDER: Record<string, number> = {
  PERSON1: 1,
  PERSON2: 2,
  Both: 3,
};

/**
 * Sorts assets according to:
 * 1. Owner order: Person 1 -> Person 2 -> Both (Joint)
 * 2. Category order: based on ASSET_CATEGORY_ORDER constant
 * 3. Acquired date: oldest date first
 * 4. Alphabetical by name if date is missing or tied
 */
export const sortAssets = (assets: NetWorthAsset[]): NetWorthAsset[] => {
  return [...assets].sort((a, b) => {
    // 1. Owner order
    const ownerA = OWNER_ORDER[a.owner || "Both"] ?? 99;
    const ownerB = OWNER_ORDER[b.owner || "Both"] ?? 99;
    if (ownerA !== ownerB) return ownerA - ownerB;

    // 2. Category order
    const catA = ASSET_CATEGORY_ORDER[a.category] ?? 99;
    const catB = ASSET_CATEGORY_ORDER[b.category] ?? 99;
    if (catA !== catB) return catA - catB;

    // 3. Acquired date (oldest first)
    if (a.acquiredDate && b.acquiredDate) {
      const timeA = new Date(a.acquiredDate).getTime();
      const timeB = new Date(b.acquiredDate).getTime();
      if (timeA !== timeB) return timeA - timeB;
    } else if (a.acquiredDate && !b.acquiredDate) {
      return -1;
    } else if (!a.acquiredDate && b.acquiredDate) {
      return 1;
    }

    // 4. Alphabetical tie-breaker
    return (a.name || "").localeCompare(b.name || "", undefined, {
      sensitivity: "base",
    });
  });
};
