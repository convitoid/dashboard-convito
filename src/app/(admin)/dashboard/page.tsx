'use client';

import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { Card } from '@/components/card';
import { BarChart } from '@/components/chart/barchart';
import { UserGroupIcon } from '@/components/icons/userGroup';
import { UsersIcon } from '@/components/icons/users';
import axios from 'axios';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const breadcrumbsData = [
   {
      name: 'dashboard',
      href: '/dashboard',
   },
   {
      name: 'statistics',
      href: '',
   },
];

const DashboardPage = () => {
   const { data: session, status } = useSession();

   const [totalClients, setTotalClients] = useState(0);
   const [totalGuests, setTotalGuests] = useState(0);
   const [guests, setGuests] = useState([]);
   const [clients, setClients] = useState([]);
   const [chartData, setChartData] = useState([]);

   useEffect(() => {
      document.title = 'Convito - Dashboard';
   });

   const getData = async () => {
      const url = '/api/admin/dashboard';
      const response = await axios.get(url);


      if (response.status === 200) {
         setTotalClients(response.data.data.totalClients);
         setTotalGuests(response.data.data.totalGuests);
         setGuests(response.data.data.guests);
         setClients(response.data.data.clients);
         setChartData(response.data.data.chartClientData);
      }
   };

   useEffect(() => {
      getData();
   }, []);

   if (status === 'loading') {
      return <div>Loading...</div>;
   }

   return (
      <div className="px-8 2md:px-0">
         <div className="flex justify-end mb-3">
            <BreadcrumbsComponent data={breadcrumbsData} />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 2md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <div className="col-span-1">
               <Card cardWrapper="bg-[#1c1c1c] text-white">
                  <h2 className="2md:text-[1rem] font-semibold">Total Clients</h2>
                  <div className="flex items-center gap-3 text-2xl">
                     <UsersIcon />
                     <span>{totalClients ?? 0}</span>
                  </div>
               </Card>
            </div>
            <div className="col-span-1">
               <Card cardWrapper="bg-[#1c1c1c] text-white">
                  <h2 className="2md:text-[1rem] font-semibold">Total Guests</h2>
                  <div className="flex items-center gap-3 text-2xl">
                     <UserGroupIcon />
                     <span>{totalGuests ?? 0}</span>
                  </div>
               </Card>
            </div>
         </div>
         <div className="mt-4">
            <div className="flex items-center justify-between mb-6">
               <h1 className="font-semibold text-sm lg:text-lg xl:text-xl">
                  Convito Clients Statistics {moment().format('YYYY')}
               </h1>
            </div>
            <BarChart statisticsData={chartData} />
         </div>
      </div>
   );
};

export default DashboardPage;
