import { ChartColumnBig, ListCollapse, SquarePlus } from "lucide-react";

export enum PERSONS {
  PERSON1 = "PERSON1",
  PERSON2 = "PERSON2",
  BOTH = "Both",
}

export const PAID_BY_OPTIONS = [PERSONS.PERSON1, PERSONS.PERSON2];

export const PAID_FOR_OPTIONS = [
  PERSONS.PERSON1,
  PERSONS.BOTH,
  PERSONS.PERSON2,
];

export enum EXPENSE_CATEGORY_VALUES {
  FOOD = "Food",
  SOCIAL = "Social",
  TRANSPORTATION = "Transportation",
  HOUSEHOLD = "Household",
  APPAREL = "Apparel",
  BEAUTY = "Beauty",
  HEALTH = "Health",
  EDUCATION = "Education",
  GIFT = "Gift",
  HOME = "Home",
  SHOPPING = "Shopping",
  BIRTHDAY = "Birthday",
  VACATION = "Vacation",
}

export const EXPENSE_CATEGORY_OPTIONS = [
  EXPENSE_CATEGORY_VALUES.FOOD,
  EXPENSE_CATEGORY_VALUES.SOCIAL,
  EXPENSE_CATEGORY_VALUES.TRANSPORTATION,
  EXPENSE_CATEGORY_VALUES.HOUSEHOLD,
  EXPENSE_CATEGORY_VALUES.APPAREL,
  EXPENSE_CATEGORY_VALUES.BEAUTY,
  EXPENSE_CATEGORY_VALUES.HEALTH,
  EXPENSE_CATEGORY_VALUES.EDUCATION,
  EXPENSE_CATEGORY_VALUES.GIFT,
  EXPENSE_CATEGORY_VALUES.HOME,
  EXPENSE_CATEGORY_VALUES.SHOPPING,
  EXPENSE_CATEGORY_VALUES.BIRTHDAY,
  EXPENSE_CATEGORY_VALUES.VACATION,
];

export const sample = [
  {
    amount: 1231,
    category: "Food",
    date: "2024-12-11T15:38:31.572Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "PERSON2",
    id: "1733931522231",
  },
  {
    amount: 123,
    category: "Food",
    date: "2024-12-11T15:38:31.572Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "PERSON1",
    id: "1733931519550",
  },
  {
    amount: 2233,
    category: "Home",
    date: "2024-11-30T18:30:00.000Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733679443179",
  },
  {
    amount: 12333,
    category: "Vacation",
    date: "2024-11-30T18:30:00.000Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733679437216",
  },
  {
    amount: 123,
    category: "Food",
    date: "2024-11-30T18:30:00.000Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733679339060",
  },
  {
    amount: 324,
    category: "Education",
    date: "2024-12-08T17:35:09.770Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733679314207",
  },
  {
    amount: 23321,
    category: "Birthday",
    date: "2024-12-07T06:30:35.367Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733553037307",
  },
  {
    amount: 324,
    category: "Health",
    date: "2024-12-07T06:30:30.580Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733553035367",
  },
  {
    amount: 500,
    category: "Home",
    date: "2024-12-07T06:30:27.664Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733553030580",
  },
  {
    amount: 200,
    category: "Household",
    date: "2024-12-07T06:30:22.640Z",
    description: "",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733553027664",
  },
  {
    amount: 400,
    category: "Transportation",
    date: "2024-12-07T05:53:04.339Z",
    description: "nothing",
    paidBy: "PERSON1",
    paidFor: "Both",
    id: "1733550824595",
  },
];

export const BOTTOM_BAR_LINKS = [
  {
    route: "add-expense",
    title: "Add Expense",
    icon: SquarePlus,
  },
  {
    route: "my-expenses",
    title: "Track Expenses",
    icon: ListCollapse,
  },
  {
    route: "statistics",
    title: "Statistics",
    icon: ChartColumnBig,
  },
];
