"use client";

import ExpenseList from "@/components/common/expense-list";
import { Input } from "@/components/ui/input";
import { useSearchExpenses } from "@/hooks/use-search-expenses";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const { data: expenses, isLoading } = useSearchExpenses(debouncedQuery);

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : debouncedQuery.length > 2 ? (
          expenses && expenses.length > 0 ? (
            <ExpenseList expenses={expenses} />
          ) : (
            <div className="text-center text-muted-foreground mt-10">
              No expenses found matching &quot;{debouncedQuery}&quot;
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground mt-10 text-sm">
            Type at least 3 characters to search...
          </div>
        )}
      </div>
    </div>
  );
}
