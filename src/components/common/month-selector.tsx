import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { useState } from "react";

type MonthSelectorProps = {
  date: Date;
  changeMonth: (number: number) => void;
  onDateChange: (date: Date) => void;
  description?: string;
};

export default function MonthSelector({
  date,
  changeMonth,
  onDateChange,
  description,
}: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(date);

  const month = date?.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    setIsOpen(false);
  };

  const changeYear = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(viewDate.getFullYear() + increment);
    setViewDate(newDate);
  };

  return (
    <div className="flex items-center justify-between p-2">
      <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex-1 text-center flex flex-col cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-colors"
            onClick={() => setViewDate(date)}
          >
            <span className="font-semibold text-primary flex items-center justify-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {month}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeYear(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg">
                {viewDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeYear(1)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, index) => (
                <Button
                  key={m}
                  variant={
                    date.getMonth() === index &&
                    date.getFullYear() === viewDate.getFullYear()
                      ? "default"
                      : "outline"
                  }
                  className={cn(
                    "w-full text-xs",
                    date.getMonth() === index &&
                      date.getFullYear() === viewDate.getFullYear()
                      ? "bg-primary text-primary-foreground"
                      : ""
                  )}
                  onClick={() => handleMonthSelect(index)}
                >
                  {m.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
