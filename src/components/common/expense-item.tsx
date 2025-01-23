import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PERSONS } from "@/lib/constants";
import { getAmountLabel } from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import AddExpenseForm from "./add-expense-form";
import { Expense } from "./expense-list";

type ExpenseItemProps = {
  expense: Expense;
};

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const { PERSON1, PERSON2 } = useConfigStore();
  const { category, amount, description, date, paidBy, paidFor } =
    expense ?? {};

  const getPaidByLabel = () => {
    if (paidBy === PERSONS.PERSON1) return `${PERSON1} paid`;
    if (paidBy === PERSONS.PERSON2) return `${PERSON2} paid`;
    return `${paidBy} paid`;
  };
  const paidByLabel = getPaidByLabel();
  const dateLabel = new Date(date)?.toLocaleDateString();

  const getBgColor = () => {
    if (paidFor === PERSONS.PERSON1) return "bg-blue-100";
    if (paidFor === PERSONS.PERSON2) return "bg-pink-100";
    return "bg-green-100";
  };

  if (!expense) {
    return null;
  }

  return (
    <>
      <div
        className={`flex justify-between items-center p-2 border-b border-separate ${getBgColor()}`}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-700">
            {category}
          </span>
          <span className="text-xs text-gray-500">{description}</span>
          <span className="text-xs text-gray-500">{dateLabel}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500">{paidByLabel}</span>
          <span className="text-lg font-bold text-gray-800">
            {getAmountLabel(amount)}
          </span>
        </div>
      </div>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <AddExpenseForm initialValues={expense} />
        </DialogContent>
      </Dialog>
    </>
  );
}
