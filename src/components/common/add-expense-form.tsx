"use client";

import CustomFormField from "@/components/common/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddExpense, useEditExpense } from "@/hooks/use-manage-expense";
import { useToast } from "@/hooks/use-toast";
import { FORM_FIELDS, FormFieldNameType, PERSONS } from "@/lib/constants";
import useConfigStore from "@/store/use-config-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object(
  FORM_FIELDS.reduce(
    (schema, field) => {
      schema[field.name] = field.validation;
      return schema;
    },
    {} as Record<FormFieldNameType, any>,
  ),
);

export type AddExpensesFormValues = z.infer<typeof formSchema>;

interface AddExpenseFormProps {
  initialValues?: Partial<AddExpensesFormValues>;
  id?: string | null;
  onSuccess?: () => void;
}

export default function AddExpenseForm({
  initialValues = {},
  id,
  onSuccess,
}: AddExpenseFormProps) {
  const { toast } = useToast();
  const configStore = useConfigStore();

  const isEdit = !!id;

  const addMutation = useAddExpense(onSuccess);
  const editMutation = useEditExpense(id || "", onSuccess);

  const isPending = addMutation.isPending || editMutation.isPending;

  const onSubmit = (data: AddExpensesFormValues) => {
    if (isEdit) {
      editMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };

  const form = useForm<AddExpensesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...FORM_FIELDS.reduce(
        (defaults, field) => {
          defaults[field.name] = field.defaultValue || "";
          return defaults;
        },
        {} as Record<FormFieldNameType, string | number>,
      ),
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
        {FORM_FIELDS.map((field) => {
          const { name, type, label, options } = field;

          return (
            <CustomFormField
              key={name}
              name={name}
              type={type}
              label={getLabel(label)}
              options={options?.map((option) => ({
                ...option,
                label: getLabel(option.label),
              }))}
              control={form.control}
            />
          );
        })}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isEdit ? "Save" : "Submit"}
          <CheckCheck />
        </Button>
      </form>
    </Form>
  );
}
