"use client";

import { usePathname } from "next/navigation";
import { HomeIcon } from "../icons/home";
import { MenuIcon } from "../icons/menu";
import { SidebarMenuLink } from "../sidebar/sidebarMenuLink";
import { SidebarMenuSection } from "../sidebar/sidebarMenuSection";
import { SidebarMenu } from "../sidebar/sidebarMenu";
import { AccordionComponent } from "../accordion";
import { SettingIcon } from "../icons/setting";

export const DrawerComponent = () => {
  const pathname = usePathname();
  return (
    <div className="drawer block 2md:hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="bg-transparent drawer-button block"
        >
          <MenuIcon />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-slate-800 min-h-full w-80 p-4 text-slate-200">
          {/* Sidebar content here */}
          <li className="text-2xl px-3 py-4 mb-4 uppercase font-semibold">
            Cenvito
          </li>
          <li className="mb-2">
            <SidebarMenuSection>
              <SidebarMenuLink
                link="/dashboard"
                title="Dashboard"
                icon={<HomeIcon />}
                isActive={pathname === "/dashboard"}
              />
            </SidebarMenuSection>
          </li>
          <li className="mb-2">
            <SidebarMenuSection title="Data">
              <AccordionComponent
                menuIcon={<HomeIcon />}
                menuTitle="Customers"
                isActive={pathname === "/customers"}
              />
              <AccordionComponent
                menuIcon={<HomeIcon />}
                menuTitle="Customers"
              />
            </SidebarMenuSection>
          </li>
          <li className="mb-2">
            <SidebarMenuSection title="Utilities">
              <AccordionComponent
                menuIcon={<SettingIcon />}
                menuTitle="Setting Users"
              />
            </SidebarMenuSection>
          </li>
        </ul>
      </div>
    </div>
  );
};
