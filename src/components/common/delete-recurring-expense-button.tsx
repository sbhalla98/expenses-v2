import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDeleteRecurringExpense } from "@/hooks/use-manage-recurring-expense";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteRecurringExpenseButtonProps {
  id: string;
}

const DeleteRecurringExpenseButton = ({
  id,
}: DeleteRecurringExpenseButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useDeleteRecurringExpense(() => {
    setIsOpen(false);
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete the
            recurring expense.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate(id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Continue"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteRecurringExpenseButton;
