import Link from 'next/link';

type SidebarMenuLinkProps = {
   link: string;
   title?: string;
   icon?: any;
   isActive?: boolean;
};

export const SidebarMenuLink = ({ link, title, icon, isActive }: SidebarMenuLinkProps) => {
   return (
      <Link
         href={link}
         className={`text-slate-100 font-medium w-full text-left bg-bg-transparent hover:bg-white hover:text-[#1c1c1c] transition duration-100 ease-in  p-3 rounded-lg flex items-center gap-4 ${
            isActive ? 'bg-white text-[#1c1c1c]' : ''
         }`}
      >
         {icon}
         <span className="2md:text-[.7rem] lg:text-[.8rem] xl:text-[.9rem] font-medium">{title}</span>
      </Link>
   );
};
