import Link from "next/link";
import { AccordionComponent } from "../accordion";
import { SidebarMenuSection } from "./sidebarMenuSection";
import { SidebarMenuLink } from "./sidebarMenuLink";
import { HomeIcon } from "../icons/home";
import { SettingIcon } from "../icons/setting";

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
        <AccordionComponent
          menuIcon={<HomeIcon />}
          menuTitle="Customers"
          isActive={currentPath === "/customers"}
        />
        <AccordionComponent menuIcon={<HomeIcon />} menuTitle="Customers" />
      </SidebarMenuSection>
      <SidebarMenuSection title="Utilities">
        <AccordionComponent
          menuIcon={<SettingIcon />}
          menuTitle="Setting Users"
        />
      </SidebarMenuSection>
    </>
  );
};
