import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useConfigStore from "@/store/use-config-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";

const formSchema = z.object({
  person1: z.string().min(1, "Person 1 name is required"),
  person2: z.string().min(1, "Person 2 name is required"),
  userId: z.string().min(1, "User id is required"),
});

export type ConfirmFormValues = z.infer<typeof formSchema>;

export default function ConfigForm({
  onSubmitForm,
}: {
  onSubmitForm: () => void;
}) {
  const configStore = useConfigStore();

  const form = useForm<ConfirmFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person1: configStore.PERSON1,
      person2: configStore.PERSON2,
      userId: configStore.userId || "",
    },
  });

  const onSubmit = (data: ConfirmFormValues) => {
    configStore.setLabels(data.person1, data.person2);
    configStore.setUserId(data.userId);
    onSubmitForm();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name={"person1"}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>Person 1 Name</FormLabel>
              <FormControl>
                <Input {...formField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"person2"}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>Person 2 Name</FormLabel>
              <FormControl>
                <Input {...formField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"userId"}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>user id</FormLabel>
              <FormControl>
                <Input {...formField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
