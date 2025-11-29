"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { BOTTOM_BAR_LINKS } from "@/lib/constants";
import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ConfigForm from "./config-form";

const Header = () => {
  const { toast } = useToast();
  const pathName = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const { title = "Track Expenses" } =
    BOTTOM_BAR_LINKS.find(
      (link) => pathName.includes(link.route) || pathName === link.route,
    ) ?? {};

  const onSubmitForm = () => {
    toast({
      title: "Config updated!",
    });
    setSheetOpen(false);
    window.location.reload();
  };

  return (
    <section className="fixed top-0 z-10 w-full bg-black text-white">
      <div className="flex flex-row items-center justify-between p-2">
        <h1 className="font-bold text-xl">{title}</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon">
              <Settings />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Configurations</SheetTitle>
            </SheetHeader>
            <ConfigForm onSubmitForm={onSubmitForm} />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default Header;
