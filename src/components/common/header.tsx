"use client";

import { BOTTOM_BAR_LINKS } from "@/lib/constants";
import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const Header = () => {
  const pathName = usePathname();
  const { title = "Track Expenses" } =
    BOTTOM_BAR_LINKS.find(
      (link) => pathName.includes(link.route) || pathName === link.route,
    ) ?? {};

  return (
    <section className="fixed top-0 z-10 w-full bg-black text-white">
      <div className="flex flex-row items-center justify-between p-2">
        <h1 className="font-bold text-xl">{title}</h1>
        <Button size="icon">
          <Settings />
        </Button>
      </div>
    </section>
  );
};

export default Header;
