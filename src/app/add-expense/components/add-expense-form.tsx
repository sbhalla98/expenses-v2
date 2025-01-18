import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Controller, useForm } from "react-hook-form";
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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: FORM_FIELDS.reduce((defaults, field) => {
      defaults[field.name] = field.defaultValue || "";
      return defaults;
    }, {}),
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {FORM_FIELDS.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "number" || field.type === "text" ? (
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name, {
                    valueAsNumber: field.type === "number",
                  })}
                  className="mt-2"
                />
              ) : null}

              {field.type === "radio" ? (
                <RadioGroup
                  className="space-y-2"
                  defaultValue={field.defaultValue}
                >
                  {field.options.map((option) => (
                    <div className="flex items-center space-x-2" key={option}>
                      <RadioGroupItem
                        value={option}
                        id={`${field.name}-${option}`}
                        {...register(field.name)}
                        d
                      />
                      <Label htmlFor={`${field.name}-${option}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : null}

              {field.type === "select" ? (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: selectField }) => (
                    <Select onValueChange={selectField.onChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : null}

              {field.type === "date" ? (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: dateField }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full mt-2">
                          {dateField.value
                            ? format(dateField.value, "dd/MM/yyyy")
                            : `Select ${field.label}`}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={dateField.value}
                          onSelect={dateField.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              ) : null}

              {errors[field.name] && (
                <p className="text-red-500 text-sm">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
