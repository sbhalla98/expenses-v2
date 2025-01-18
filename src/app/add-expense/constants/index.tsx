import { z } from "zod";

export type FormFieldType = "number" | "text" | "radio" | "select" | "date";

export type FormField = {
  name: string;
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
    options: ["Vishal", "Sonali"],
    defaultValue: "Vishal",
    validation: z.enum(["Vishal", "Sonali"], {
      errorMap: () => ({ message: "Please select who paid" }),
    }),
  },
  {
    name: "paidFor",
    label: "Paid For",
    type: "radio",
    defaultValue: "Both",
    options: ["Vishal", "Sonali", "Both"],
    validation: z.enum(["Vishal", "Sonali", "Both"], {
      errorMap: () => ({ message: "Please select who it was paid for" }),
    }),
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Food",
      "Social",
      "Transportation",
      "Household",
      "Apparel",
      "Beauty",
      "Health",
      "Education",
      "Gift",
      "Home",
      "Shopping",
      "Birthday",
      "Vacation",
    ],
    defaultValue: "Food",
    validation: z.enum(
      [
        "Food",
        "Social",
        "Transportation",
        "Household",
        "Apparel",
        "Beauty",
        "Health",
        "Education",
        "Gift",
        "Home",
        "Shopping",
        "Birthday",
        "Vacation",
      ],
      {
        errorMap: () => ({ message: "Please select a category" }),
      }
    ),
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
