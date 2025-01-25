import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type MonthSelectorProps = {
  date: Date;
  changeMonth: (number: number) => void;
  description?: string;
};

export default function MonthSelector({
  date,
  changeMonth,
  description,
}: MonthSelectorProps) {
  const month = date?.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-2">
      <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
        <ArrowLeft />
      </Button>
      <div className="flex-1 text-center flex flex-col">
        <span className="font-semibold text-primary">{month}</span>
        <span className="font-semibold text-primary">{description}</span>
      </div>
      <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
        <ArrowRight />
      </Button>
    </div>
  );
}
