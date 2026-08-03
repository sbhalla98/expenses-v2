"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerInputProps {
  value?: Date | string | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
}: DatePickerInputProps) {
  const parseValueToDate = (val: any): Date | null => {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) return val;
    if (typeof val === "string") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
      const parsed = parse(val, "dd-MM-yyyy", new Date());
      if (isValid(parsed)) return parsed;
    }
    return null;
  };

  const selectedDate = parseValueToDate(value);

  const formatDateToString = (d: Date | null): string => {
    if (!d) return "";
    return format(d, "dd-MM-yyyy");
  };

  const [inputText, setInputText] = useState<string>(
    formatDateToString(selectedDate)
  );
  const [month, setMonth] = useState<Date>(selectedDate || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const prevInputRef = useRef<string>(inputText);

  // Sync inputText and month when value prop changes externally
  useEffect(() => {
    const d = parseValueToDate(value);
    const formatted = formatDateToString(d);
    setInputText((prev) => (prev !== formatted ? formatted : prev));
    prevInputRef.current = formatted;
    if (d) {
      setMonth((prev) => (prev.getTime() !== d.getTime() ? d : prev));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const isDeleting = rawVal.length < prevInputRef.current.length;

    // Keep only digits
    const digits = rawVal.replace(/\D/g, "").slice(0, 8);

    let formatted = "";
    if (digits.length === 0) {
      formatted = "";
    } else if (digits.length <= 2) {
      if (digits.length === 2 && !isDeleting) {
        formatted = `${digits}-`;
      } else {
        formatted = digits;
      }
    } else if (digits.length <= 4) {
      if (digits.length === 4 && !isDeleting) {
        formatted = `${digits.slice(0, 2)}-${digits.slice(2)}-`;
      } else {
        formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
      }
    } else {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
    }

    setInputText(formatted);
    prevInputRef.current = formatted;

    if (formatted.length === 0) {
      onChange(undefined);
    } else if (formatted.length === 10) {
      const parsed = parse(formatted, "dd-MM-yyyy", new Date());
      if (isValid(parsed) && format(parsed, "dd-MM-yyyy") === formatted) {
        onChange(parsed);
        setMonth(parsed);
      } else {
        onChange(undefined);
      }
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "dd-MM-yyyy");
      setInputText(formatted);
      prevInputRef.current = formatted;
      setMonth(date);
      onChange(date);
      setIsOpen(false);
    } else {
      setInputText("");
      prevInputRef.current = "";
      onChange(undefined);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      const d = parseValueToDate(value);
      if (d) {
        setMonth(d);
      } else if (inputText.length === 10) {
        const parsed = parse(inputText, "dd-MM-yyyy", new Date());
        if (isValid(parsed)) {
          setMonth(parsed);
        }
      } else {
        setMonth(new Date());
      }
    }
  };

  return (
    <div className="relative flex items-center mt-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={inputText}
        onChange={handleInputChange}
        maxLength={10}
        className="h-12 text-base pr-11 font-mono tracking-wider"
      />
      <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            month={month}
            onMonthChange={setMonth}
            defaultMonth={selectedDate || new Date()}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
