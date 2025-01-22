"use client";

import { BOTTOM_BAR_LINKS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Bottombar = () => {
  const pathName = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full bg-black p-4 backdrop-blur-lg xs:px-7 text-white">
      <div className="flex items-center justify-between gap-3 xs:gap-5">
        {BOTTOM_BAR_LINKS.map((link) => {
          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName === link.route;

          const route = link.route;
          return (
            <Link
              key={link.label}
              href={route}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                height={28}
                width={28}
              />
              <p className="textsubtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
