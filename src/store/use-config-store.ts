import { PERSONS } from "@/lib/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paidBy?: string;
  paidFor?: string;
};

export type ConfigStore = {
  [PERSONS.PERSON1]: string;
  [PERSONS.PERSON2]: string;
  userId?: string;
  currentMonth: string;
  setLabels: (person1: string, person2: string) => void;
  setUserId: (userId: string) => void;
  setCurrentMonth: (date: string) => void;
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => {
      return {
        [PERSONS?.PERSON1]: "John",
        [PERSONS?.PERSON2]: "Mary",
        currentMonth: new Date().toISOString(),
        setLabels: (person1, person2) => {
          set({
            [PERSONS.PERSON1]: person1,
            [PERSONS.PERSON2]: person2,
          });
        },
        setUserId: (userId) => {
          set({ userId });
        },
        setCurrentMonth: (date) => {
          set({
            currentMonth: date,
          });
        },
      };
    },
    {
      name: "config",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useConfigStore;
