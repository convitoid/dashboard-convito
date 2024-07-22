"use client";

import { NavbarComponent } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import moment from "moment";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <main className="h-screen flex">
      <SidebarComponent />
      <div className={`w-full flex-1 overflow-y-auto`}>
        <NavbarComponent />
        <div className="">
          <div className="py-3 px-6">{children}</div>
          <footer className="font-bold static bottom-0 w-full">
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
