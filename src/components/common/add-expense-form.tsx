import CustomFormField from "@/components/common/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { FORM_FIELDS, FormFieldNameType } from "@/lib/constants";
import { Expense } from "@/store/use-config-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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

export default function AddExpenseForm() {
  const { toast } = useToast();

  const handleAddExpense = async (expense: Expense) => {
    return await apiClient.post("/api/add-expense", expense);
  };
  const { mutate, isPending } = useMutation<unknown, Error, Expense>({
    mutationFn: handleAddExpense,
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Expense added!",
        description: "Your expense has been added successfully.",
      });
    },
  });

  const form = useForm<AddExpensesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: FORM_FIELDS.reduce(
      (defaults, field) => {
        defaults[field.name] = field.defaultValue || "";
        return defaults;
      },
      {} as Record<FormFieldNameType, string | number>,
    ),
  });

  const onSubmit = (data: AddExpensesFormValues) => {
    mutate(data as Expense);
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
              label={label}
              options={options}
              control={form.control}
            />
          );
        })}

        {isPending ? (
          <Skeleton className="w-full h-[36px] rounded-md" />
        ) : (
          <Button type="submit" className="w-full">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
