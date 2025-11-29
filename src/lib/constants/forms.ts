import { z } from "zod";
import { EXPENSE_CATEGORY_OPTIONS, EXPENSE_CATEGORY_VALUES } from "./categories";
import { PAID_BY_OPTIONS, PAID_FOR_OPTIONS, PERSONS } from "./persons";

export type FormFieldType =
  | "number"
  | "text"
  | "radio"
  | "select"
  | "date"
  | "textarea";

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
  defaultValue: string | number | Date;
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
    type: "textarea",
    defaultValue: "",
    validation: z.string().min(1, "Description is required"),
  },
];
