"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarNavigation } from "@/constants/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarNavigation.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              href={item.route}
              className={`leftsidebar_link ${
                isActive && "bg-secondary-orange"
              }`}
              key={item.route}
            >
              <item.icon className="w-6 h-6" />
              <p className="text-base">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
