'use client';

import Link from 'next/link';

type BreadcrumbItem = {
   name: string;
   href: string;
};

interface BreadcrumbsProps {
   data: BreadcrumbItem[];
}
export const BreadcrumbsComponent = ({ data }: BreadcrumbsProps) => {
   return (
      <div className="breadcrumbs text-sm">
         <ul>
            {data?.map((item, index) => (
               <li key={index}>
                  {/* for first item olny text-blue-500 */}
                  <Link
                     href={item.href}
                     className={`capitalize no-underline text-md ${index === 0 ? 'text-blue-500' : ''}`}
                  >
                     {item.name}
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
};
