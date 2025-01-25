import { ChartColumnBig, Edit, ListCollapse, SquarePlus } from "lucide-react";
import { z } from "zod";

export enum PERSONS {
  PERSON1 = "PERSON1",
  PERSON2 = "PERSON2",
  BOTH = "Both",
}

export const PAID_BY_OPTIONS = [
  { value: PERSONS.PERSON1, label: PERSONS.PERSON1 },
  { value: PERSONS.PERSON2, label: PERSONS.PERSON2 },
];

export const PAID_FOR_OPTIONS = [
  { value: PERSONS.PERSON1, label: PERSONS.PERSON1 },
  { value: PERSONS.BOTH, label: PERSONS.BOTH },
  { value: PERSONS.PERSON2, label: PERSONS.PERSON2 },
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
  {
    value: EXPENSE_CATEGORY_VALUES.FOOD,
    label: EXPENSE_CATEGORY_VALUES.FOOD,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.SOCIAL,
    label: EXPENSE_CATEGORY_VALUES.SOCIAL,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.TRANSPORTATION,
    label: EXPENSE_CATEGORY_VALUES.TRANSPORTATION,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.HOUSEHOLD,
    label: EXPENSE_CATEGORY_VALUES.HOUSEHOLD,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.APPAREL,
    label: EXPENSE_CATEGORY_VALUES.APPAREL,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.BEAUTY,
    label: EXPENSE_CATEGORY_VALUES.BEAUTY,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.HEALTH,
    label: EXPENSE_CATEGORY_VALUES.HEALTH,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.EDUCATION,
    label: EXPENSE_CATEGORY_VALUES.EDUCATION,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.GIFT,
    label: EXPENSE_CATEGORY_VALUES.GIFT,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.HOME,
    label: EXPENSE_CATEGORY_VALUES.HOME,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.SHOPPING,
    label: EXPENSE_CATEGORY_VALUES.SHOPPING,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.BIRTHDAY,
    label: EXPENSE_CATEGORY_VALUES.BIRTHDAY,
  },
  {
    value: EXPENSE_CATEGORY_VALUES.VACATION,
    label: EXPENSE_CATEGORY_VALUES.VACATION,
  },
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
  {
    route: "edit-expense",
    title: "Edit Expense",
    icon: Edit,
    hidden: true,
  },
];

export type FormFieldType = "number" | "text" | "radio" | "select" | "date";

export type FormFieldNameType =
  | "amount"
  | "description"
  | "paidBy"
  | "paidFor"
  | "category"
  | "date";

export type FormField = {
  name: FormFieldNameType;
  label: string;
  type: FormFieldType;
  defaultValue: any;
  validation: z.ZodTypeAny;
  options?: {
    value: string;
    label: string;
  }[]; // Optional field for radio/select options
};

export const FORM_FIELDS: FormField[] = [
  {
    name: "date",
    label: "Date",
    type: "date",
    defaultValue: new Date(),
    validation: z.date({
      required_error: "Please select a date",
      invalid_type_error: "Invalid date",
    }),
  },

  {
    name: "paidBy",
    label: "Paid By",
    type: "radio",
    options: PAID_BY_OPTIONS,
    defaultValue: PERSONS.PERSON1,
    validation: z.enum(
      PAID_BY_OPTIONS.map((item) => item.value) as [string, ...string[]],
      {
        errorMap: () => ({ message: "Please select who paid" }),
      },
    ),
  },
  {
    name: "paidFor",
    label: "Paid For",
    type: "radio",
    defaultValue: PERSONS.BOTH,
    options: PAID_FOR_OPTIONS,
    validation: z.enum(
      PAID_FOR_OPTIONS.map((item) => item.value) as [string, ...string[]],
      {
        errorMap: () => ({ message: "Please select who it was paid for" }),
      },
    ),
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: EXPENSE_CATEGORY_OPTIONS,
    defaultValue: EXPENSE_CATEGORY_VALUES.FOOD,
    validation: z.enum(
      EXPENSE_CATEGORY_OPTIONS.map((item) => item.value) as [
        string,
        ...string[],
      ],
      {
        errorMap: () => ({ message: "Please select a category" }),
      },
    ),
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    defaultValue: 0,
    validation: z
      .number({ invalid_type_error: "Amount must be a number" })
      .min(1, "Amount must be at least 1"),
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    defaultValue: "",
    validation: z.string().min(1, "Description is required"),
  },
];
