"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

type AccordionProps = {
  menuIcon?: any;
  menuTitle?: string;
  isActive?: boolean;
};

export const AccordionComponent = ({
  menuIcon,
  menuTitle,
  isActive,
}: AccordionProps) => {
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
          isActive ? "bg-slate-900" : ""
        } hover:bg-gray-900 focus:outline-none text-white transition duration-100 ease-in rounded-lg`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {menuIcon}
            <span className="ml-2 font-medium 2md:text-[.7rem] xl:text-[.9rem]">
              {menuTitle}
            </span>
          </div>
          <svg
            className={`w-6 h-6 transform ${
              isOpen ? "rotate-180" : ""
            } transition duration-100 ease-in`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
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
        <div className="overflow-hidden p-4 text-slate-100">test</div>
      </Transition>
    </div>
  );
};
