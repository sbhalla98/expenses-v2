import DeleteRecurringExpenseButton from "@/components/common/delete-recurring-expense-button";
import { Button } from "@/components/ui/button";
import { PERSONS } from "@/lib/constants";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

interface RecurringExpenseCardProps {
  expense: any;
  index: number;
  onEdit: (expense: any) => void;
}

export default function RecurringExpenseCard({
  expense,
  index,
  onEdit,
}: RecurringExpenseCardProps) {
  const configStore = useConfigStore();

  const getLabel = (label: string) => {
    if (label === PERSONS.PERSON1 || label === PERSONS.PERSON2) {
      return configStore[label];
    }
    return label;
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4 shadow-sm bg-card">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <span className="font-bold text-lg text-muted-foreground min-w-[20px]">
            {index + 1}.
          </span>
          <div>
            <h3 className="font-semibold text-lg">{expense.description}</h3>
            <p className="text-sm text-muted-foreground">
              {expense.frequency} • Next:{" "}
              {format(new Date(expense.nextPaymentDate), "PPP")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{getAmountLabel(expense.amount)}</p>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            {expense.category}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          Paid by: {getLabel(expense.paidBy)} • For:{" "}
          {getLabel(expense.paidFor)}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteRecurringExpenseButton id={expense.id} />
        </div>
      </div>
    </div>
  );
}
