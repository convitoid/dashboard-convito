'use client';

import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { ArrowUturnLeftIcon } from '@/components/icons/arrowUturnLeft';
import { ChatBubleLeftRight } from '@/components/icons/chatBubleLeftRight';
import { Data } from '@/components/icons/data';
import { PaperAirplane } from '@/components/icons/paperAirplane';
import { Photo } from '@/components/icons/photo';
import { PresentationChartLine } from '@/components/icons/presentationChardLine';
import { QrCode } from '@/components/icons/qrCode';
import { Question } from '@/components/icons/question';
import { Tab } from '@/components/tab';
import { QrBroadcastTemplateTab } from '@/components/tab/QrBroadcastTemplateTab';
import { QrDashboardTab } from '@/components/tab/QrDashboardTab';
import { QrDataGuestTab } from '@/components/tab/QrDataGuestTab';
import { QrDataTab } from '@/components/tab/QrDataTab';
import { QrGallerytab } from '@/components/tab/QrGallerytab';
import { QrSendBroadcast } from '@/components/tab/QrSendBroadcast';
import Link from 'next/link';
import { useEffect } from 'react';

const breadcrumbsData = [
   {
      name: 'dashboard',
      href: '/dashboard',
   },
   {
      name: 'clients',
      href: '/dashboard/clients',
   },
   {
      name: 'QR',
      href: '',
   },
];

export default function QrClients({ params }: { params: { clientId: string } }) {
   const tabs = [
      {
         name: 'Dashboard',
         icon: <PresentationChartLine />,
         content: <QrDashboardTab clientId={params.clientId} />,
         disabled: false,
      },
      {
         name: 'Gallery',
         icon: <Photo />,
         content: <QrGallerytab clientId={params.clientId} />,
         disabled: false,
      },
      {
         name: 'QR Data',
         icon: <QrCode className="size-6 me-2" />,
         content: <QrDataTab clientId={params.clientId} />,
         disabled: false,
      },
      {
         name: 'Guest Data',
         icon: <Data />,
         content: <QrDataGuestTab clientId={params.clientId} />,
         disabled: false,
      },
      {
         name: 'Broadcast Template',
         icon: <ChatBubleLeftRight />,
         content: <QrBroadcastTemplateTab clientId={params.clientId} />,
         disabled: false,
      },
      {
         name: 'Send Broadcast',
         icon: <PaperAirplane />,
         content: <QrSendBroadcast clientId={params.clientId} />,
         disabled: false,
      },
   ];
   useEffect(() => {
      document.title = 'Convito - QR Code';
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
         <Tab clientId={params.clientId} tabs={tabs} />
      </>
   );
}
