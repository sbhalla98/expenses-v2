import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type MonthSelectorProps = {
  date: Date;
  changeMonth: (number: number) => void;
};

export default function MonthSelector({
  date,
  changeMonth,
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
      <p className="font-semibold text-primary flex-1 text-center">{month}</p>
      <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
        <ArrowRight />
      </Button>
    </div>
  );
}
