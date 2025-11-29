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
import { Control, Controller } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";

interface CustomFormFieldProps {
  name: string;
  type: string;
  label: string;
  options?: {
    value: string;
    label: string;
  }[];
  control: Control<any>;
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
            {type === "text" && (
              <Input {...formField} className="h-12 text-base" />
            )}

            {type === "textarea" && (
              <Textarea {...formField} className="min-h-[100px] text-base" />
            )}

            {type === "number" && (
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                {...formField}
                className="h-12 text-lg font-medium"
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
                    <TabsList className="w-full h-12">
                      {options?.map((option) => (
                        <TabsTrigger
                          className="flex-1 h-10 text-sm"
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
                      const isSelected = field.value === option.value;
                      return (
                        <Badge
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          className={`text-sm py-1.5 px-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-md scale-105"
                              : "hover:bg-secondary/50"
                          }`}
                          onClick={() => field.onChange(option.value)}
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
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 h-12 text-base justify-start text-left font-normal"
                  >
                    {formField.value &&
                    !isNaN(new Date(formField.value).getTime())
                      ? format(formField.value, "PPP")
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
