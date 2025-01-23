import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 left-2"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            expense from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return;
};

export default DeleteExpenseButton;
