"use client";

import CustomFormField from "@/components/common/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    useAddRecurringExpense,
    useEditRecurringExpense,
} from "@/hooks/use-manage-recurring-expense";
import { useToast } from "@/hooks/use-toast";
import {
    EXPENSE_CATEGORY_OPTIONS,
    EXPENSE_CATEGORY_VALUES,
    PAID_BY_OPTIONS,
    PAID_FOR_OPTIONS,
    PERSONS,
    RECURRING_FREQUENCY,
    RECURRING_FREQUENCY_OPTIONS,
} from "@/lib/constants";
import useConfigStore from "@/store/use-config-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, "Amount must be at least 1"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  paidBy: z.string().min(1, "Paid By is required"),
  paidFor: z.string().min(1, "Paid For is required"),
  frequency: z.string().min(1, "Frequency is required"),
  nextPaymentDate: z.date({
    required_error: "Please select a start date",
    invalid_type_error: "Invalid date",
  }),
});

export type RecurringExpenseFormValues = z.infer<typeof formSchema>;

interface RecurringExpenseFormProps {
  initialValues?: Partial<RecurringExpenseFormValues>;
  id?: string | null;
  onSuccess?: () => void;
}

export default function RecurringExpenseForm({
  initialValues = {},
  id,
  onSuccess,
}: RecurringExpenseFormProps) {
  const { toast } = useToast();
  const configStore = useConfigStore();
  const isEdit = !!id;
  const addMutation = useAddRecurringExpense(onSuccess);
  const editMutation = useEditRecurringExpense(id || "", onSuccess);

  const isPending = addMutation.isPending || editMutation.isPending;

  const onSubmit = (data: RecurringExpenseFormValues) => {
    if (isEdit) {
      editMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };

  const form = useForm<RecurringExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: EXPENSE_CATEGORY_VALUES.FOOD,
      description: "",
      paidBy: PERSONS.PERSON1,
      paidFor: PERSONS.BOTH,
      frequency: RECURRING_FREQUENCY.MONTHLY,
      nextPaymentDate: new Date(),
      ...initialValues,
    },
  });


  const getLabel = (label: string) => {
    if (label === PERSONS.PERSON1 || label === PERSONS.PERSON2) {
      return configStore[label];
    }
    return label;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <CustomFormField
          name="nextPaymentDate"
          label="Start Date"
          type="date"
          control={form.control}
        />
        <CustomFormField
          name="frequency"
          label="Frequency"
          type="select"
          options={RECURRING_FREQUENCY_OPTIONS}
          control={form.control}
        />
        <CustomFormField
          name="paidBy"
          label="Paid By"
          type="radio"
          options={PAID_BY_OPTIONS.map((option) => ({
            ...option,
            label: getLabel(option.label),
          }))}
          control={form.control}
        />
        <CustomFormField
          name="paidFor"
          label="Paid For"
          type="radio"
          options={PAID_FOR_OPTIONS.map((option) => ({
            ...option,
            label: getLabel(option.label),
          }))}
          control={form.control}
        />
        <CustomFormField
          name="category"
          label="Category"
          type="select"
          options={EXPENSE_CATEGORY_OPTIONS}
          control={form.control}
        />
        <CustomFormField
          name="amount"
          label="Amount"
          type="number"
          control={form.control}
        />
        <CustomFormField
          name="description"
          label="Description"
          type="textarea"
          control={form.control}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isEdit ? "Save" : "Submit"}
          <CheckCheck className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
