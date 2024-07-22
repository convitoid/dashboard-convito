"use client";

import Link from "next/link";
import { SidebarMenu } from "./sidebarMenu";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const SidebarComponent = () => {
  const pathname = usePathname();
  useEffect(() => {}, []);

  return (
    <div className="h-screen bg-gray-800 hidden 2md:block 2md:w-[13%] xl:w-[15%] px-4 py-6 flex-none overflow-y-auto">
      <div className="mb-10">
        <Link
          href={"/dashboard"}
          className="text-slate-200 font-semibold uppercase text-2xl"
        >
          Cenvito
        </Link>
      </div>
      <div>
        <SidebarMenu currentPath={pathname} />
      </div>
    </div>
  );
};
