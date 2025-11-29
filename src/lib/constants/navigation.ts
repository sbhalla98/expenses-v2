import {
  ChartColumnBig,
  Edit,
  ListCollapse,
  Repeat,
  Search,
  SquarePlus,
} from "lucide-react";

export const APP_ROUTES = {
  HOME: "/",
  ADD_EXPENSE: "/add-expense",
  MY_EXPENSES: "/my-expenses",
  STATISTICS: "/statistics",
  EDIT_EXPENSE: "/edit-expense",
  RECURRING_EXPENSES: "/recurring-expenses",
  SEARCH: "/search",
  BILLS: "/bills",
} as const;

export const BOTTOM_BAR_LINKS = [
  {
    route: APP_ROUTES.ADD_EXPENSE,
    title: "Add Expense",
    icon: SquarePlus,
  },
  {
    route: APP_ROUTES.MY_EXPENSES,
    title: "Track Expenses",
    icon: ListCollapse,
  },
  {
    route: APP_ROUTES.STATISTICS,
    title: "Statistics",
    icon: ChartColumnBig,
  },
  {
    route: APP_ROUTES.EDIT_EXPENSE,
    title: "Edit Expense",
    icon: Edit,
    hidden: true,
  },
  {
    route: APP_ROUTES.RECURRING_EXPENSES,
    title: "Recurring",
    icon: Repeat,
  },
  {
    route: APP_ROUTES.SEARCH,
    title: "Search",
    icon: Search,
  },
];
