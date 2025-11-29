import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

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
import { useDeleteExpense } from "@/hooks/use-manage-expense";
import { useState } from "react";

type DeleteExpenseButtonProps = {
  id: string;
  onSuccess?: () => void;
};
const DeleteExpenseButton = ({ id, onSuccess }: DeleteExpenseButtonProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const deleteMutation = useDeleteExpense(() => {
    setOpen(false);
    onSuccess?.();
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="px-4">
          <Button variant="destructive" className="w-full">
            Delete <Trash2 />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80%]">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            expense from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            onClick={() => deleteMutation.mutate(id)}
            disabled={deleteMutation.isPending}
            variant="destructive"
          >
            {deleteMutation.isPending ? "Deleting..." : "Continue"}
          </Button>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteExpenseButton;
