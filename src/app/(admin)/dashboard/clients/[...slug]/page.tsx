'use client';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { Card } from '@/components/card';
import { ArrowUturnLeftIcon } from '@/components/icons/arrowUturnLeft';
import { Tab } from '@/components/tab';
import Link from 'next/link';
import { useEffect } from 'react';

const breadcrumbsData = [
   {
      name: 'dashboard',
      href: '/dashboard',
   },
   {
      name: 'customers',
      href: '/dashboard/customers',
   },
   {
      name: 'customer detail',
      href: '',
   },
];

const CustomerDetailPage = ({ params }: { params: { slug: string } }) => {
   useEffect(() => {
      document.title = 'Convito - Customers Detail';
   }, []);
   return (
      <>
         <div className="flex items-center justify-between mb-8">
            <Link
               href="/dashboard/clients"
               className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-950 transition duration-100 ease-in flex items-center gap-2"
            >
               <ArrowUturnLeftIcon className={'size-5'} />
               <span>Back</span>
            </Link>
            <BreadcrumbsComponent data={breadcrumbsData} />
         </div>
         <Tab clientId={params.slug} />
      </>
   );
};

export default CustomerDetailPage;
