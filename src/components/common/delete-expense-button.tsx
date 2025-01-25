import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
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

type DeleteExpenseButtonProps = {
  id: string;
  onSuccess?: () => void;
};
const DeleteExpenseButton = ({ id, onSuccess }: DeleteExpenseButtonProps) => {
  const { toast } = useToast();

  const handleAddExpense = async () => {
    return await apiClient.post(`/api/delete-expense`, { id });
  };
  const { mutate, isPending } = useMutation<unknown, Error>({
    mutationFn: handleAddExpense,
    onError: () => {
      toast({
        title: "Something went wrong!",
        description: "Please try again later.",
      });
    },
    onSuccess: () => {
      toast({
        title: `Expense deleted!`,
        description: `Your expense has been deleted successfully.`,
      });
      onSuccess?.();
    },
  });
  return (
    <Drawer>
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
            onClick={() => mutate()}
            disabled={isPending}
            variant="destructive"
          >
            Continue
          </Button>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteExpenseButton;
