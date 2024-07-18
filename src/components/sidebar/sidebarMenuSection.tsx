type SidebarMenuSectionProps = {
  children?: React.ReactNode;
  title?: string;
};

export const SidebarMenuSection = ({
  children,
  title,
}: SidebarMenuSectionProps) => {
  return (
    <div className="mb-5">
      <span className="text-slate-300 font-light capitalize text-sm">
        {title}
      </span>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
};
