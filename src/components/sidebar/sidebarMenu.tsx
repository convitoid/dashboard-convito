import Link from 'next/link';
import { AccordionComponent } from '../accordion';
import { SidebarMenuSection } from './sidebarMenuSection';
import { SidebarMenuLink } from './sidebarMenuLink';
import { HomeIcon } from '../icons/home';
import { SettingIcon } from '../icons/setting';
import { UsersIcon } from '../icons/users';
import { ChatBubleLeftIcon } from '../icons/chatBubleLeft';

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
                    isActive={currentPath === '/dashboard'}
                />
            </SidebarMenuSection>
            <SidebarMenuSection title="Data">
                <SidebarMenuLink
                    link="/dashboard/clients"
                    title="Clients"
                    icon={<UsersIcon />}
                    isActive={currentPath === '/dashboard/clients'}
                />
            </SidebarMenuSection>
            <SidebarMenuSection title="Utilities">
                <SidebarMenuLink
                    link="/dashboard/test-blasting"
                    title="Test Blasting"
                    icon={<ChatBubleLeftIcon />}
                    isActive={currentPath === '/dashboard/test-blasting'}
                />
                <AccordionComponent
                    menuIcon={<SettingIcon />}
                    menuTitle="Setting Users"
                    isActive={currentPath === '/dashboard/users'}
                />
            </SidebarMenuSection>
        </>
    );
};
