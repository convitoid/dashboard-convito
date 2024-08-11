type SidebarMenuSectionProps = {
    children?: React.ReactNode;
    title?: string;
};

export const SidebarMenuSection = ({
    children,
    title,
}: SidebarMenuSectionProps) => {
    return (
        <div className="mb-5 flex flex-col items-start w-full ">
            <span
                className={`text-slate-300 font-light capitalize text-sm ${
                    title ?? 'hidden'
                }`}
            >
                {title}
            </span>
            <div className="mt-4 flex flex-col gap-2 w-full">{children}</div>
        </div>
    );
};
