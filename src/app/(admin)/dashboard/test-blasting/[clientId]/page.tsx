'use client';
import { getDetailLogs } from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import { AppDispatch, RootState } from '@/app/store';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { DataTablesComponent } from '@/components/datatables';
import { ArrowUturnLeftIcon } from '@/components/icons/arrowUturnLeft';
import { ChevronDoubleLeftIcon } from '@/components/icons/chevronDoubleLeft';
import { da } from '@faker-js/faker';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BreadCrumbsData = [
   { name: 'Dashboard', href: '/dashboard' },
   { name: 'Test Blasting', href: '/dashboard/test-blasting' },
   { name: 'Detail Logs Test Blasting', href: '' },
];

const tableHead = ['No', 'Phone Number', 'Event Name', 'Sender Name', 'Invitation Link', 'Question', 'Answer'];

const DetailLogsPage = ({ params }: { params: { clientId: string } }) => {
   const id = params.clientId;
   const dispatch = useDispatch<AppDispatch>();
   const data = useSelector((state: RootState) => state.testBlasting.detailLogs);
   const status = useSelector((state: RootState) => state.testBlasting.statusDetailLogs);

   useEffect(() => {
      dispatch(getDetailLogs(id));
   }, [dispatch, id]);

   useEffect(() => {
      document.title = 'Convito - Detail Logs Test Blasting';
   }, []);

   return (
      <>
         <div className="flex items-center justify-between mb-3">
            <h1 className="font-semibold text-2xl">Detail Log Test Blasting</h1>
            <BreadcrumbsComponent data={BreadCrumbsData} />
         </div>
         <div className="tooltip tooltip-bottom mb-5" data-tip="Back to testing">
            <Link href="/dashboard/test-blasting" className="btn bg-slate-900 font-semibold text-white">
               <ArrowUturnLeftIcon />
            </Link>
         </div>
         <DataTablesComponent tableHead={tableHead}>
            {status === 'loading' || status === 'idle' ? (
               <tr>
                  <td colSpan={7} className="text-center py-4">
                     <span className="loading loading-spinner loading-lg"></span>
                  </td>
               </tr>
            ) : (
               <>
                  {Array.isArray(data) && data.length > 0 ? (
                     data.flatMap((item: any, index: number) =>
                        item.questionLog.map((itemData: any, itemIndex: number) => (
                           <tr key={itemData.id}>
                              <td className="border-b-[1px] py-2 px-4 w-[3%]">{itemIndex + 1}</td>
                              <td className="border-b-[1px] py-2 px-4">{item.phoneNumber}</td>
                              <td className="border-b-[1px] py-2 px-4">{item.eventName}</td>
                              <td className="border-b-[1px] py-2 px-4">{item.senderName}</td>
                              <td className="border-b-[1px] py-2 px-4">{item.invitationLink}</td>
                              <td className="border-b-[1px] py-2 px-4">{itemData.question}</td>
                              <td className="border-b-[1px] py-2 px-4 capitalize">
                                 {itemData.answer === null ? (
                                    <span className="text-red-500">No Answer</span>
                                 ) : itemData.answer ? (
                                    itemData.answer
                                 ) : (
                                    'No Answer'
                                 )}
                              </td>
                           </tr>
                        ))
                     )
                  ) : (
                     <tr>
                        <td colSpan={7} className="text-center py-4">
                           No data found
                        </td>
                     </tr>
                  )}
               </>
            )}
         </DataTablesComponent>
      </>
   );
};

export default DetailLogsPage;
