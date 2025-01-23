import CustomFormField from "@/components/common/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { FORM_FIELDS, FormFieldNameType, PERSONS } from "@/lib/constants";
import useConfigStore, { Expense } from "@/store/use-config-store";
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

interface AddExpenseFormProps {
  initialValues?: Partial<AddExpensesFormValues>;
  id?: string;
  onSuccess?: () => void;
}

export default function AddExpenseForm({
  initialValues = {},
  id,
  onSuccess,
}: AddExpenseFormProps) {
  const { toast } = useToast();
  const configStore = useConfigStore();

  const handleAddExpense = async (expense: Expense) => {
    if (id) {
      return await apiClient.post(`/api/edit-expense`, { ...expense, id });
    }
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
        title: `Expense ${id ? "updated" : "added"}!`,
        description: `Your expense has been ${id ? "updated" : "added"} successfully.`,
      });
      onSuccess?.();
    },
  });

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

  const onSubmit = (data: AddExpensesFormValues) => {
    mutate(data as Expense);
  };

  const getLabel = (label: string) => {
    if (label === PERSONS.PERSON1 || label === PERSONS.PERSON2) {
      return configStore[PERSONS.PERSON1];
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
