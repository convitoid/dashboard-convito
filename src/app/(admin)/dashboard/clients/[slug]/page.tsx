'use client';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { ArrowUturnLeftIcon } from '@/components/icons/arrowUturnLeft';
import { ChatBubleLeftRight } from '@/components/icons/chatBubleLeftRight';
import { Data } from '@/components/icons/data';
import { DocumentText } from '@/components/icons/documentText';
import { PaperAirplane } from '@/components/icons/paperAirplane';
import { Photo } from '@/components/icons/photo';
import { PresentationChartLine } from '@/components/icons/presentationChardLine';
import { Question } from '@/components/icons/question';
import { Tab } from '@/components/tab';
import { BroadcastTemplateTab } from '@/components/tab/BroadcastTemplateTab';
import { DashboardTab } from '@/components/tab/DashboardTab';
import { DataTab } from '@/components/tab/DataTab';
import { GalleryTab } from '@/components/tab/GalleryTab';
import { QuestionTab } from '@/components/tab/QuestionTab';
import { ScenarioTab } from '@/components/tab/ScenarioTab';
import { SendBroadcastTab } from '@/components/tab/SendBroadcastTab';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientSlice } from '../../../../GlobalRedux/Features/clients/clientSlice';
import { AppDispatch, RootState } from '../../../../store';

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
      name: 'RSVP',
      href: '',
   },
];

const CustomerDetailPage = ({ params }: { params: { slug: string } }) => {
   const dispatch = useDispatch<AppDispatch>();
   const NavbarTitle = useSelector((state: RootState) => state.clients.navbarTitle);

   const tabs = [
      {
         name: 'Dashboard',
         icon: <PresentationChartLine />,
         content: <DashboardTab clientId={params.slug.toString()} />,
         disabled: false,
      },
      {
         name: 'Gallery',
         icon: <Photo />,
         content: <GalleryTab clientId={params.slug} />,
         disabled: false,
      },
      {
         name: 'Guest Data',
         icon: <Data />,
         content: <DataTab clientId={params.slug} />,
         disabled: false,
      },
      {
         name: 'Questions',
         icon: <Question />,
         content: <QuestionTab clientId={params.slug} />,
         disabled: false,
      },
      {
         name: 'Broadcast Template',
         icon: <ChatBubleLeftRight />,
         content: <BroadcastTemplateTab clientId={params.slug} />,
         disabled: false,
      },
      {
         name: 'Scenario',
         icon: <DocumentText />,
         content: <ScenarioTab clientId={params.slug} />,
         disabled: false,
      },
      {
         name: 'Send Broadcast',
         icon: <PaperAirplane />,
         content: <SendBroadcastTab clientId={params.slug} />,
         disabled: false,
      },
   ];

   const getClientName = async () => {
      const response = await axios.get(`/api/clients/${params.slug}`);
      console.log(`${response.data.data.client_id} - ${response.data.data.client_name}`);

      dispatch(
         clientSlice.actions.setNavbarTitle(`${response.data.data.client_id} - ${response.data.data.client_name}`)
      );

      return `${response.data.data.client_id} - ${response.data.data.client_name}`;
   };

   useEffect(() => {
      getClientName();
   }, [params.slug]);


   useEffect(() => {
      document.title = 'Convito - RSVP';
   }, []);
   return (
      <div>
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
         <Tab clientId={params.slug} tabs={tabs} />
      </div>
   );
};

export default CustomerDetailPage;
