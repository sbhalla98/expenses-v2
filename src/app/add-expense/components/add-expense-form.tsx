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
import { FORM_FIELDS } from "../constants";

const formSchema = z.object(
  FORM_FIELDS.reduce((schema, field) => {
    schema[field.name] = field.validation;
    return schema;
  }, {})
);

type FormValues = z.infer<typeof formSchema>;

export default function AddExpenseForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: FORM_FIELDS.reduce((defaults, field) => {
      defaults[field.name] = field.defaultValue || "";
      return defaults;
    }, {}),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {FORM_FIELDS.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                id={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <>
                        {field.type === "number" || field.type === "text" ? (
                          <Input
                            type={field.type}
                            {...register(field.name, {
                              valueAsNumber: field.type === "number",
                            })}
                          />
                        ) : null}
                        {field.type === "radio" ? (
                          <RadioGroup
                            onValueChange={formField.onChange}
                            defaultValue={field.defaultValue}
                            className="flex flex-col space-y-1"
                          >
                            {field.options.map((option) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
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

                        {field.type === "select" ? (
                          <Select onValueChange={formField.onChange}>
                            <SelectTrigger className="mt-2">
                              <SelectValue
                                placeholder={`Select ${field.label}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}

                        {field.type === "date" ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full mt-2">
                                {formField.value
                                  ? format(formField.value, "dd/MM/yyyy")
                                  : `Select ${field.label}`}
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
            ))}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
