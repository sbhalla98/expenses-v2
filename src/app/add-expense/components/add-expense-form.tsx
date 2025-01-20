import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FORM_FIELDS, FormFieldNameType } from "../constants";
import CustomFormField from "./custom-form-field";

const formSchema = z.object(
  FORM_FIELDS.reduce((schema, field) => {
    schema[field.name] = field.validation;
    return schema;
  }, {} as Record<FormFieldNameType, any>)
);

export type AddExpensesFormValues = z.infer<typeof formSchema>;

export default function AddExpenseForm({
  onAddExpense,
}: {
  onAddExpense: (expense: AddExpensesFormValues) => void;
}) {
  const form = useForm<AddExpensesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: FORM_FIELDS.reduce((defaults, field) => {
      defaults[field.name] = field.defaultValue || "";
      return defaults;
    }, {} as Record<FormFieldNameType, string | number>),
  });

  const onSubmit = (data: AddExpensesFormValues) => {
    onAddExpense(data);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 h-full">
      <CardHeader>
        <CardTitle>Add Your Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
