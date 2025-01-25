import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { Badge } from "../ui/badge";

interface CustomFormFieldProps {
  name: string;
  type: string;
  label: string;
  options?: {
    value: string;
    label: string;
  }[];
  control: any;
}

const CustomFormField = ({
  name,
  type,
  label,
  options,
  control,
}: CustomFormFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field: formField }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <>
            {type === "text" && <Input {...formField} />}

            {type === "number" && (
              <Input
                type="number"
                {...formField}
                onChange={(event) => formField.onChange(+event.target.value)}
              />
            )}

            {type === "radio" && (
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Tabs
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      {options?.map((option) => (
                        <TabsTrigger
                          className="flex-1"
                          value={option.value}
                          key={option.value}
                        >
                          {option.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              />
            )}

            {type === "select" && (
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {options?.map((option) => {
                      const isSelected = field.value.includes(option.value);
                      return (
                        <Badge
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => field.onChange([option.value])}
                        >
                          {option.label}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              />
            )}

            {type === "date" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">
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
            )}
          </>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CustomFormField;
