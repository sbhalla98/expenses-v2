"use client";

import { useState } from "react";
import GroupedExpenseList from "@/components/common/grouped-expense-list";
import MonthSelector from "@/components/common/month-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useExpenses } from "@/hooks/use-expenses";
import {
  useBulkEditExpenses,
  useBulkDeleteExpenses,
} from "@/hooks/use-manage-expense";
import {
  getAmountLabel,
  getCurrentMonthExpenses,
  getExpenseAmount,
  getGroupedByDate,
} from "@/lib/utils";
import useConfigStore from "@/store/use-config-store";
import { EXPENSE_CATEGORY_OPTIONS } from "@/lib/constants/categories";
import { PERSONS } from "@/lib/constants/persons";
import { format } from "date-fns";
import {
  Trash2,
  Edit,
  X,
  Calendar as LucideCalendar,
  Sparkles,
} from "lucide-react";

export default function MyExpenses() {
  const { currentMonth: currentDateString, setCurrentMonth } = useConfigStore();
  const configStore = useConfigStore();
  const currentDate = new Date(currentDateString);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  // Bulk Edit field states
  const [updateCategory, setUpdateCategory] = useState(false);
  const [category, setCategory] = useState<string>("");

  const [updatePaidBy, setUpdatePaidBy] = useState(false);
  const [paidBy, setPaidBy] = useState<string>("");

  const [updatePaidFor, setUpdatePaidFor] = useState(false);
  const [paidFor, setPaidFor] = useState<string>("");

  const [updateDate, setUpdateDate] = useState(false);
  const [bulkDate, setBulkDate] = useState<Date>(new Date());

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentMonth(newDate.toISOString());
  };

  const { isLoading, data } = useExpenses();

  // Mutations
  const bulkEditMutation = useBulkEditExpenses(() => {
    setIsSelectionMode(false);
    setSelectedIds([]);
    setIsEditDialogOpen(false);
    // Reset inputs
    setUpdateCategory(false);
    setUpdatePaidBy(false);
    setUpdatePaidFor(false);
    setUpdateDate(false);
  });

  const bulkDeleteMutation = useBulkDeleteExpenses(() => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  });

  const allExpenses = data?.data ?? [];
  const visibleExpenses = getCurrentMonthExpenses(allExpenses, currentDate);
  const groupedByDate = getGroupedByDate(visibleExpenses);
  const currentExpense = getAmountLabel(getExpenseAmount(visibleExpenses));

  // Selection handlers
  const handleStartSelectionMode = (id: string) => {
    setIsSelectionMode(true);
    setSelectedIds([id]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected expenses?`,
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const handleBulkEditSubmit = () => {
    const updates: Record<string, any> = {};
    if (updateCategory && category) updates.category = category;
    if (updatePaidBy && paidBy) updates.paidBy = paidBy;
    if (updatePaidFor && paidFor) updates.paidFor = paidFor;
    if (updateDate && bulkDate) updates.date = bulkDate.toISOString();

    if (Object.keys(updates).length === 0) {
      alert("Please select at least one field to update.");
      return;
    }

    bulkEditMutation.mutate({
      ids: selectedIds,
      updates,
    });
  };

  if (isLoading) {
    return (
      <div className="size-full flex flex-col">
        <div className="p-2">
          <Skeleton className="h-12 " />
        </div>
        <div className="p-4">
          <Skeleton className="h-4" />
        </div>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div className="mt-2 mx-2" key={index}>
              <Skeleton className="h-[68px] rounded-xl" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col relative overflow-hidden">
      <MonthSelector
        date={currentDate}
        changeMonth={changeMonth}
        onDateChange={(date) => setCurrentMonth(date.toISOString())}
        description={currentExpense}
      />
      <div className="flex-1 overflow-y-auto pb-28 pt-2">
        <GroupedExpenseList
          groupedExpenses={groupedByDate}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onStartSelectionMode={handleStartSelectionMode}
        />
      </div>

      {/* Floating Bulk Operations Bar */}
      {isSelectionMode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[92%] bg-black text-white rounded-2xl p-3.5 shadow-2xl border border-white/10 z-50 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col pl-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Selected
            </span>
            <span className="text-sm font-black">{selectedIds.length} Items</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0 || bulkDeleteMutation.isPending}
              className="h-9 px-3 text-xs gap-1.5 font-bold"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={selectedIds.length === 0}
              className="h-9 px-3 text-xs gap-1.5 font-bold bg-white text-black hover:bg-gray-100"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancelSelection}
              className="h-9 w-9 text-gray-400 hover:text-white rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bulk edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[360px] rounded-2xl p-4 gap-3 bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-black flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
              Bulk Edit ({selectedIds.length} Expenses)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Category */}
            <div className="flex items-start gap-2.5 border-b border-gray-100 pb-3">
              <input
                type="checkbox"
                id="edit-category"
                className="mt-1 h-4 w-4 rounded accent-black"
                checked={updateCategory}
                onChange={(e) => setUpdateCategory(e.target.checked)}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="edit-category" className="font-bold text-gray-700">
                  Update Category
                </Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={!updateCategory}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paid By */}
            <div className="flex items-start gap-2.5 border-b border-gray-100 pb-3">
              <input
                type="checkbox"
                id="edit-paidBy"
                className="mt-1 h-4 w-4 rounded accent-black"
                checked={updatePaidBy}
                onChange={(e) => setUpdatePaidBy(e.target.checked)}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="edit-paidBy" className="font-bold text-gray-700">
                  Update Paid By
                </Label>
                <Select
                  value={paidBy}
                  onValueChange={setPaidBy}
                  disabled={!updatePaidBy}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PERSONS.PERSON1} className="text-xs">
                      {configStore.PERSON1}
                    </SelectItem>
                    <SelectItem value={PERSONS.PERSON2} className="text-xs">
                      {configStore.PERSON2}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paid For */}
            <div className="flex items-start gap-2.5 border-b border-gray-100 pb-3">
              <input
                type="checkbox"
                id="edit-paidFor"
                className="mt-1 h-4 w-4 rounded accent-black"
                checked={updatePaidFor}
                onChange={(e) => setUpdatePaidFor(e.target.checked)}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="edit-paidFor" className="font-bold text-gray-700">
                  Update Paid For
                </Label>
                <Select
                  value={paidFor}
                  onValueChange={setPaidFor}
                  disabled={!updatePaidFor}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Paid For" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PERSONS.PERSON1} className="text-xs">
                      {configStore.PERSON1}
                    </SelectItem>
                    <SelectItem value={PERSONS.PERSON2} className="text-xs">
                      {configStore.PERSON2}
                    </SelectItem>
                    <SelectItem value={PERSONS.BOTH} className="text-xs">
                      Both (Joint)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-2.5 pb-2">
              <input
                type="checkbox"
                id="edit-date"
                className="mt-1 h-4 w-4 rounded accent-black"
                checked={updateDate}
                onChange={(e) => setUpdateDate(e.target.checked)}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="edit-date" className="font-bold text-gray-700">
                  Update Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-9 text-xs"
                      disabled={!updateDate}
                    >
                      <LucideCalendar className="mr-2 h-3.5 w-3.5 text-gray-400" />
                      {bulkDate ? format(bulkDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={bulkDate}
                      onSelect={(d) => d && setBulkDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="flex-1 h-10 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkEditSubmit}
              disabled={bulkEditMutation.isPending}
              className="flex-1 h-10 text-xs font-bold text-white"
            >
              {bulkEditMutation.isPending ? "Saving..." : "Save Fields"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
