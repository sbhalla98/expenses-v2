import CustomFormField from "@/components/common/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useAddNetWorthAsset,
  useEditNetWorthAsset,
} from "@/hooks/use-net-worth";
import { PERSONS } from "@/lib/constants";
import useConfigStore from "@/store/use-config-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  trackingType: z.enum(["value", "quantity", "fd"]),
  owner: z.enum(["PERSON1", "PERSON2", "Both"]),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(0, "Quantity must be non-negative")
    .optional(),
  unitLabel: z.string().optional(),
  principal: z
    .number({ invalid_type_error: "Principal must be a number" })
    .min(0, "Principal must be non-negative")
    .optional(),
  interestRate: z
    .number({ invalid_type_error: "Interest rate must be a number" })
    .min(0, "Interest rate must be non-negative")
    .optional(),
  startDate: z.date().optional(),
  maturityDate: z.date().optional(),
  notes: z.string().optional(),
});

export type NetWorthAssetFormValues = z.infer<typeof formSchema>;

const CATEGORY_OPTIONS = [
  { value: "saving", label: "Savings / Cash" },
  { value: "fixed_deposit", label: "Fixed Deposit" },
  { value: "gold", label: "Gold" },
  { value: "retirement", label: "Retirement" },
  { value: "equity", label: "Equity / Stocks" },
  { value: "mutual_funds", label: "Mutual Funds" },
  { value: "property", label: "Property" },
  { value: "vehicles", label: "Vehicles" },
  { value: "other", label: "Other" },
];

const TRACKING_TYPE_OPTIONS = [
  { value: "value", label: "Direct Value" },
  { value: "quantity", label: "Quantity & Price" },
  { value: "fd", label: "Fixed Deposit" },
];

interface NetWorthAssetFormProps {
  initialValues?: Partial<NetWorthAssetFormValues>;
  id?: string | null;
  onSuccess?: () => void;
}

const getFormDefaults = (vals: Partial<any> = {}): NetWorthAssetFormValues => {
  const parseDate = (d: any) => {
    if (!d) return new Date();
    if (d instanceof Date && !isNaN(d.getTime())) return d;
    if (typeof d === "string") {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  };

  return {
    name: vals.name || "",
    category: vals.category || "saving",
    trackingType: vals.trackingType || "value",
    owner: vals.owner || "Both",
    quantity: vals.quantity ?? 0,
    unitLabel: vals.unitLabel || "units",
    principal: vals.principal ?? 0,
    interestRate: vals.interestRate ?? 0,
    startDate: parseDate(vals.startDate),
    maturityDate: parseDate(vals.maturityDate),
    notes: vals.notes || "",
  };
};

export default function NetWorthAssetForm({
  initialValues = {},
  id,
  onSuccess,
}: NetWorthAssetFormProps) {
  const isEdit = !!id;
  const config = useConfigStore();
  const addMutation = useAddNetWorthAsset(onSuccess);
  const editMutation = useEditNetWorthAsset(id || "", onSuccess);
  const isPending = addMutation.isPending || editMutation.isPending;

  const form = useForm<NetWorthAssetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaults(initialValues),
  });

  const prevIdRef = useRef(id);
  useEffect(() => {
    if (prevIdRef.current !== id) {
      prevIdRef.current = id;
      form.reset(getFormDefaults(initialValues));
    }
  }, [id, initialValues, form]);

  const selectedCategory = form.watch("category");
  const selectedTrackingType = form.watch("trackingType");

  const ownerOptions = [
    { value: "Both", label: "Joint / Both" },
    { value: "PERSON1", label: config[PERSONS.PERSON1] || "Person 1" },
    { value: "PERSON2", label: config[PERSONS.PERSON2] || "Person 2" },
  ];

  // Keep trackingType in sync with Category for user convenience
  useEffect(() => {
    if (!isEdit) {
      if (selectedCategory === "gold") {
        form.setValue("trackingType", "quantity");
        form.setValue("unitLabel", "grams");
      } else if (selectedCategory === "fixed_deposit") {
        form.setValue("trackingType", "fd");
      } else {
        form.setValue("trackingType", "value");
      }
    }
  }, [selectedCategory, isEdit, form]);

  const onSubmit = (data: NetWorthAssetFormValues) => {
    const submissionData: any = {
      name: data.name,
      category: data.category,
      trackingType: data.trackingType,
      owner: data.owner,
      notes: data.notes || "",
    };

    if (data.trackingType === "quantity") {
      submissionData.quantity = data.quantity || 0;
      submissionData.unitLabel = data.unitLabel || "units";
    } else if (data.trackingType === "fd") {
      submissionData.principal = data.principal || 0;
      submissionData.interestRate = data.interestRate || 0;
      if (data.startDate) {
        submissionData.startDate = data.startDate.toISOString();
      }
      if (data.maturityDate) {
        submissionData.maturityDate = data.maturityDate.toISOString();
      }
    }

    if (isEdit) {
      editMutation.mutate(submissionData);
    } else {
      addMutation.mutate(submissionData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Category Choice */}
        <CustomFormField
          name="category"
          label="Category / Asset Class"
          type="select"
          options={CATEGORY_OPTIONS}
          control={form.control}
        />

        {/* Owner Choice */}
        <CustomFormField
          name="owner"
          label="Asset Owner"
          type="select"
          options={ownerOptions}
          control={form.control}
        />

        {/* Tracking Type choice */}
        <CustomFormField
          name="trackingType"
          label="Tracking Method"
          type="select"
          options={TRACKING_TYPE_OPTIONS}
          control={form.control}
        />

        {/* Item Name */}
        <CustomFormField
          name="name"
          label="Asset Name (e.g. Stocks @ Kite, EPF @ Uber)"
          type="text"
          control={form.control}
        />

        {/* Notes */}
        <CustomFormField
          name="notes"
          label="Notes (e.g. app, bank name, credentials)"
          type="text"
          control={form.control}
        />

        {/* Quantity specific configurations */}
        {selectedTrackingType === "quantity" && (
          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              name="quantity"
              label="Quantity / Units"
              type="number"
              control={form.control}
            />
            <CustomFormField
              name="unitLabel"
              label="Unit Label (e.g. grams, shares)"
              type="text"
              control={form.control}
            />
          </div>
        )}

        {/* Fixed Deposit specific configurations */}
        {selectedTrackingType === "fd" && (
          <>
            <CustomFormField
              name="principal"
              label="Principal Amount"
              type="number"
              control={form.control}
            />
            <CustomFormField
              name="interestRate"
              label="Interest Rate (%)"
              type="number"
              control={form.control}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                name="startDate"
                label="Start Date"
                type="date"
                control={form.control}
              />
              <CustomFormField
                name="maturityDate"
                label="Maturity Date"
                type="date"
                control={form.control}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isEdit ? "Save Asset" : "Add Asset"}
          <CheckCheck className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
