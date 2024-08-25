'use client';

type ProfileDropdownProps = {
   initial: string;
   children: React.ReactNode;
};

export const ProfileDropdownComponent = ({ initial, children }: ProfileDropdownProps) => {
   return (
      <div className="dropdown dropdown-bottom dropdown-end">
         <div tabIndex={0} role="button">
            <div className="avatar online placeholder">
               <div className="bg-neutral text-neutral-content w-9 rounded-full">
                  <span className="text-[.9rem]">{initial}</span>
               </div>
            </div>
         </div>
         <ul tabIndex={0} className="dropdown-content menu bg-slate-600 rounded-box z-[1] w-52 p-2 shadow text-white">
            {children}
         </ul>
      </div>
   );
};
