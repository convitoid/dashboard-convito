'use client';

import Link from 'next/link';
import { SidebarMenu } from './sidebarMenu';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export const SidebarComponent = () => {
   const pathname = usePathname();

   return (
      <div className="h-screen bg-[#1C1C1C] hidden 2md:block 2md:w-[20%] 3md:w-[15%] xl:w-[15%] px-4 py-8 flex-none overflow-y-auto">
         <div className="mb-10">
            <Link href={'/dashboard'} className="text-slate-200 font-semibold uppercase text-2xl flex">
               <Image
                  src={'/assets/images/main-logo.png'}
                  alt="logo"
                  width={200}
                  height={200}
                  className="h-full"
                  unoptimized
               />
            </Link>
         </div>
         <div>
            <SidebarMenu currentPath={pathname} />
         </div>
      </div>
   );
};
