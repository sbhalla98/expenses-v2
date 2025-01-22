import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_CATEGORY_VALUES,
  PAID_BY_OPTIONS,
  PAID_FOR_OPTIONS,
  PERSONS,
} from "@/lib/constants";
import { z } from "zod";

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
  options?: string[]; // Optional field for radio/select options
};

export const FORM_FIELDS: FormField[] = [
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
  {
    name: "paidBy",
    label: "Paid By",
    type: "radio",
    options: PAID_BY_OPTIONS,
    defaultValue: PERSONS.PERSON1,
    validation: z.enum(PAID_BY_OPTIONS as [string, ...string[]], {
      errorMap: () => ({ message: "Please select who paid" }),
    }),
  },
  {
    name: "paidFor",
    label: "Paid For",
    type: "radio",
    defaultValue: PERSONS.BOTH,
    options: PAID_FOR_OPTIONS,
    validation: z.enum(PAID_FOR_OPTIONS as [string, ...string[]], {
      errorMap: () => ({ message: "Please select who it was paid for" }),
    }),
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: EXPENSE_CATEGORY_OPTIONS,
    defaultValue: EXPENSE_CATEGORY_VALUES.FOOD,
    validation: z.enum(EXPENSE_CATEGORY_OPTIONS as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a category" }),
    }),
  },
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
];
