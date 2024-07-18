"use client";

import Link from "next/link";
import { SidebarMenu } from "./sidebarMenu";
import { usePathname } from "next/navigation";

export const SidebarComponent = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen bg-gray-800 hidden lg:block lg:w-[20%] xl:w-[15%] px-4 py-6">
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
