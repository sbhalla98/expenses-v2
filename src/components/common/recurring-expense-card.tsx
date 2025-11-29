import DeleteRecurringExpenseButton from "@/components/common/delete-recurring-expense-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PERSONS } from "@/lib/constants";
import { RecurringExpense } from "@/lib/types";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

interface RecurringExpenseCardProps {
  expense: RecurringExpense;
  index: number;
  onEdit: (expense: RecurringExpense) => void;
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

  const nextPaymentDate = new Date(expense.nextPaymentDate);
  const daysUntil = Math.ceil(
    (nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  const getDueColor = (days: number) => {
    if (days <= 3) return "text-red-500 font-bold";
    if (days <= 7) return "text-orange-500 font-medium";
    return "text-muted-foreground";
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-5 shadow-sm bg-card hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-secondary/50 text-secondary-foreground text-[10px] px-2 py-0.5 rounded-br-lg">
        #{index + 1}
      </div>
      <div className="flex justify-between items-start mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {expense.category}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {expense.frequency}
            </Badge>
          </div>
          <h3 className="font-bold text-xl mt-1">{expense.description}</h3>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl text-primary">
            {getAmountLabel(expense.amount)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm mt-1">
        <span className={getDueColor(daysUntil)}>
          Due {format(nextPaymentDate, "PPP")}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground text-xs">
          ({daysUntil > 0 ? `in ${daysUntil} days` : "Today/Overdue"})
        </span>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed">
        <div className="flex flex-col text-xs text-muted-foreground gap-0.5">
          <div className="flex gap-1">
            <span>Paid by:</span>
            <span className="font-medium text-foreground">
              {getLabel(expense.paidBy)}
            </span>
          </div>
          <div className="flex gap-1">
            <span>For:</span>
            <span className="font-medium text-foreground">
              {getLabel(expense.paidFor)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {expense.vpa && (
            <Button
              variant="default"
              size="sm"
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const upiParams = `&pa=${expense.vpa}&pn=${encodeURIComponent(expense.description)}&am=${expense.amount}&cu=INR`;
                const url = `gpay://upi/pay?${upiParams.substring(1)}`;
                window.open(url, "_blank");
              }}
            >
              Pay
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(expense)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteRecurringExpenseButton id={expense.id} />
        </div>
      </div>
    </div>
  );
}
