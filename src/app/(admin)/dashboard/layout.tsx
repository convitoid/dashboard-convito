"use client";

import { NavbarComponent } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import moment from "moment";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <main className="h-screen flex relative">
      <SidebarComponent />
      <div
        className={`w-full md:w-full 2md:w-[75%] 2md:ml-56 3md:ml-[18.5rem] lg:w-[75%] lg:ml-80 xl:w-[80%] xl:ml-[17%] flex-1 overflow-y-auto`}
      >
        <NavbarComponent />
        <div className="pt-12">
          <div className="py-9 2md:pr-10">{children}</div>
          <footer className="font-bold static bottom-0 w-full 2md:w-[97%] lg:w-[97%] xl:w-[98%]">
            <div className="flex justify-center items-center h-12">
              <p className="text-slate-900 text-sm">
                &copy; {moment().format("YYYY")} Cenvito - All Rights Reserved
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
