import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { FORM_FIELDS, FormFieldNameType } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "./custom-form-field";

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

export default function ConfigForm({
  onAddExpense,
  loading,
}: {
  onAddExpense: (expense: AddExpensesFormValues) => void;
  loading: boolean;
}) {
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
    onAddExpense(data);
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

        {loading ? (
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
