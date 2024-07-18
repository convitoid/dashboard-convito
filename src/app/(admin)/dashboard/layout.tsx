"use client";

import { NavbarComponent } from "@/components/navbar";
import { SidebarComponent } from "@/components/sidebar";
import moment from "moment";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const currentYear = moment().format("YYYY");

  console.log(currentYear);
  return (
    <main className="h-screen flex ">
      <SidebarComponent />
      <div className={` w-full lg:w-[80%] xl:w-[85%] py-6 px-7 relative`}>
        <NavbarComponent />
        <div className="py-6">{children}</div>
        <footer className=" text-sm font-light w-full text-center px-6 py-2 absolute bottom-0 left-0">
          {`© ${currentYear} Cenvito - All rights reserved 🚀`}
        </footer>
      </div>
    </main>
  );
};

export default AdminLayout;
