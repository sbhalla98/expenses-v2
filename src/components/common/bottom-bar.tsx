"use client";

import { BOTTOM_BAR_LINKS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const Bottombar = () => {
  const pathName = usePathname();
  const isActiveRoute = (route: string) =>
    (pathName.includes(route) && route.length > 1) || pathName === route;

  return (
    <section className="fixed bottom-0 z-10 w-full bg-black backdrop-blur-lg text-white">
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        {BOTTOM_BAR_LINKS.filter((item) => !item.hidden).map(
          ({ route, icon: Icon }) => {
            const isActive = isActiveRoute(route);

            return (
              <Link key={route} href={route}>
                <Button size="icon" variant={isActive ? "default" : "ghost"}>
                  <Icon className="scale-150" />
                </Button>
              </Link>
            );
          },
        )}
      </div>
    </section>
  );
};

export default Bottombar;
