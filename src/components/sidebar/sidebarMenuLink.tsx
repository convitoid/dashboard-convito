import Link from "next/link";

type SidebarMenuLinkProps = {
  link: string;
  title?: string;
  icon?: any;
  isActive?: boolean;
};

export const SidebarMenuLink = ({
  link,
  title,
  icon,
  isActive,
}: SidebarMenuLinkProps) => {
  return (
    <Link
      href={link}
      className={`text-slate-100 font-medium w-full text-left bg-bg-transparent hover:bg-gray-900 transition duration-100 ease-in  p-3 rounded-lg flex items-center gap-4 ${
        isActive ? "bg-gray-900" : ""
      }`}
    >
      {icon}
      <span className="text-[.9rem] font-medium">{title}</span>
    </Link>
  );
};
