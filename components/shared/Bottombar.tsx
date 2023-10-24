"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarNavigation } from "@/constants/navigation";

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarNavigation.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              href={item.route}
              className={`bottombar_link ${
                isActive && "bg-secondary-orange"
              }`}
              key={item.route}
            >
              <item.icon className="w-6 h-6" />
              <p className="text-base max-sm:hidden">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
