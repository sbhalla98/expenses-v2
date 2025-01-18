import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FORM_FIELDS, FormFieldNameType } from "../constants";

const formSchema = z.object(
  FORM_FIELDS.reduce((schema, field) => {
    schema[field.name] = field.validation;
    return schema;
  }, {} as Record<FormFieldNameType, any>)
);

type FormValues = z.infer<typeof formSchema>;

export default function AddExpenseForm() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: FORM_FIELDS.reduce((defaults, field) => {
      defaults[field.name] = field.defaultValue || "";
      return defaults;
    }, {} as Record<FormFieldNameType, string | number>),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Expense Submitted: ", data);
    toast({
      title: "Form Submitted",
      description: JSON.stringify(data, null, 2),
    });
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Add Your Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {FORM_FIELDS.map((field) => {
              const { name, type, label, options } = field;
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <>
                          {type === "text" ? <Input {...formField} /> : null}

                          {type === "number" ? (
                            <Input
                              type="number"
                              {...formField}
                              // https://github.com/shadcn-ui/ui/issues/421
                              onChange={(event) =>
                                formField.onChange(+event.target.value)
                              }
                            />
                          ) : null}

                          {type === "radio" ? (
                            <RadioGroup
                              onValueChange={formField.onChange}
                              className="flex flex-col space-y-1"
                              {...formField}
                            >
                              {options?.map((option) => (
                                <FormItem
                                  key={option}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          ) : null}

                          {type === "select" ? (
                            <Select
                              onValueChange={formField.onChange}
                              {...formField}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder={`Select ${label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : null}

                          {type === "date" ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full mt-2"
                                >
                                  {formField.value
                                    ? format(formField.value, "dd/MM/yyyy")
                                    : `Select ${label}`}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <Calendar
                                  mode="single"
                                  selected={formField.value}
                                  onSelect={formField.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : null}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
