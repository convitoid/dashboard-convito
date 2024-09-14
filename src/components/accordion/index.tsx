'use client';

import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type AccordionProps = {
   menuIcon?: any;
   menuTitle?: string;
   isActive?: boolean;
};

export const AccordionComponent = ({ menuIcon, menuTitle, isActive }: AccordionProps) => {
   const [isOpen, setIsOpen] = useState(false);

   const openMenu = () => {
      setIsOpen(!isOpen);
   };

   useEffect(() => {
      if (isActive) {
         setIsOpen(true);
      }
   }, []);

   return (
      <div className="">
         <button
            onClick={openMenu}
            className={`w-full text-left p-3 ${
               isActive ? 'bg-white text-[#1c1c1c]' : 'text-white'
            } hover:bg-white hover:text-[#1c1c1c] focus:outline-none transition duration-100 ease-in rounded-lg`}
         >
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  {menuIcon}
                  <span className="ml-2 font-medium 2md:text-[.7rem] lg:text-[.8rem] xl:text-[.9rem]">{menuTitle}</span>
               </div>
               <svg
                  className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : ''} transition duration-100 ease-in`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
         </button>

         <Transition
            show={isOpen}
            enter="transition-all duration-100 ease-in"
            enterFrom="max-h-0 opacity-0"
            enterTo="max-h-screen opacity-100"
            leave="transition-all duration-100 ease-in"
            leaveFrom="max-h-screen opacity-100"
            leaveTo="max-h-0 opacity-0"
         >
            <div className="overflow-hidden text-slate-100 py-2">
               <div className="w-full">
                  <Link
                     href="/dashboard/users"
                     className={`hover:bg-white hover:text-[#1c1c1c] block py-4 px-[3.2rem] rounded-md font-medium 2md:text-[.7rem] lg:text-[.8rem] xl:text-[.9rem]${
                        isActive ? 'bg-white' : ''
                     }`}
                  >
                     Users
                  </Link>
               </div>
            </div>
         </Transition>
      </div>
   );
};
