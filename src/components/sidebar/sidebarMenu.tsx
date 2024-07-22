import Link from "next/link";
import { AccordionComponent } from "../accordion";
import { SidebarMenuSection } from "./sidebarMenuSection";
import { SidebarMenuLink } from "./sidebarMenuLink";
import { HomeIcon } from "../icons/home";
import { SettingIcon } from "../icons/setting";
import { UsersIcon } from "../icons/users";

type SidebarMenuProps = {
  currentPath?: string;
};

export const SidebarMenu = ({ currentPath }: SidebarMenuProps) => {
  return (
    <>
      <SidebarMenuSection>
        <SidebarMenuLink
          link="/dashboard"
          title="Dashboard"
          icon={<HomeIcon />}
          isActive={currentPath === "/dashboard"}
        />
      </SidebarMenuSection>
      <SidebarMenuSection title="Data">
        <SidebarMenuLink
          link="/dashboard/customers"
          title="Customers"
          icon={<UsersIcon />}
          isActive={currentPath === "/dashboard/customers"}
        />
      </SidebarMenuSection>
      <SidebarMenuSection title="Utilities">
        <AccordionComponent
          menuIcon={<SettingIcon />}
          menuTitle="Setting Users"
          isActive={currentPath === "/dashboard/users"}
        />
      </SidebarMenuSection>
    </>
  );
};
