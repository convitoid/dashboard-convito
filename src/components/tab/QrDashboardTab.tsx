import { fetchClientQrDashboard } from '@/app/GlobalRedux/Thunk/clients/clientQrDashboardThunk';
import { AppDispatch, RootState } from '@/app/store';
import { convertStatus } from '@/utils/convertStatus';
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   RowData,
   useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronRightIcon } from '../icons/chevronRight';

type QrDashboardTabProps = {
   clientId: string;
};

export const QrDashboardTab = ({ clientId }: QrDashboardTabProps) => {
   const [columns, setColumns] = useState<ColumnDef<RowData, any>[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const dashboardData = useSelector((state: RootState) => state.clientQrDashboard.datas);
   const status = useSelector((state: RootState) => state.clientQrDashboard.status);

   useEffect(() => {
      dispatch(fetchClientQrDashboard({ clientId }));
   }, [dispatch]);

   useEffect(() => {
      const columns: ColumnDef<RowData, any>[] = [
         {
            header: 'No',
            accessorKey: 'no',
            cell: (info: any) => info.row.index + 1,
         },
         {
            header: 'Name',
            accessorKey: 'name',
         },
         {
            header: 'Phone Number',
            accessorKey: 'phoneNumber',
         },
         {
            header: 'QR Code',
            accessorKey: 'qr_code',
         },
         {
            header: 'Status (Reminder)',
            accessorKey: 'status',
            cell: (info: any) => {
               return (
                  <>
                     {typeof info.row.original.status === 'object' ? (
                        <div className="flex">
                           {info.row.original.status
                              .filter((status: any) => status.blastingSource === 'QR_REMINDER')
                              .map((status: any, index: number) => (
                                 <div
                                    key={index}
                                    className={`px-3 py-1 text-[13px] uppercase rounded-md font-semibold ${status.status === 'FAILED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                 >
                                    {status.status === 'FAILED' ? (
                                       `Failed: ${info.row.original.statusCode}`
                                    ) : (
                                       <span>{status.status}</span>
                                    )}
                                 </div>
                              ))}
                        </div>
                     ) : (
                        '-'
                     )}
                  </>
               );
            },
         },
         {
            header: 'Status (QR Code)',
            accessorKey: 'status',
            cell: (info: any) => {
               return (
                  <>
                     {typeof info.row.original.status === 'object' ? (
                        <div className="flex">
                           {info.row.original.status
                              .filter((status: any) => status.blastingSource === 'QR_CODE')
                              .map((status: any, index: number) => (
                                 <div
                                    key={index}
                                    className={`px-3 py-1 text-[13px] uppercase rounded-md font-semibold ${status.status === 'FAILED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                 >
                                    {status.status === 'FAILED' ? (
                                       `Failed: ${info.row.original.statusCode}`
                                    ) : (
                                       <span>{status.status}</span>
                                    )}
                                 </div>
                              ))}
                        </div>
                     ) : (
                        '-'
                     )}
                  </>
               );
            },
         },
         {
            header: 'Last Updated (Reminder)',
            accessorKey: 'status',
            cell: (info: any) => {
               return (
                  <>
                     {typeof info.row.original.status === 'object' ? (
                        <div className="flex">
                           {info.row.original.status
                              .filter((status: any) => status.blastingSource === 'QR_REMINDER')
                              .map((status: any, index: number) => (
                                 <div key={index} className="px-3 py-1 text-[13px] font-semibold">
                                    {status.lastUpdated}
                                 </div>
                              ))}
                        </div>
                     ) : (
                        '-'
                     )}
                  </>
               );
            },
         },
         {
            header: 'Last Updated (QR Code)',
            accessorKey: 'status',
            cell: (info: any) => {
               return (
                  <>
                     {typeof info.row.original.status === 'object' ? (
                        <div className="flex">
                           {info.row.original.status
                              .filter((status: any) => status.blastingSource === 'QR_CODE')
                              .map((status: any, index: number) => (
                                 <div key={index} className="px-3 py-1 text-[13px] font-semibold">
                                    {status.lastUpdated}
                                 </div>
                              ))}
                        </div>
                     ) : (
                        '-'
                     )}
                  </>
               );
            },
         },
      ];

      setColumns(columns);

      if (dashboardData?.data?.length > 0) {
         const data = dashboardData.data[0].guests.map((guest: any) => {
            const webhookStatus = guest.webhook;
            // const statusFiltered = status.length > 0 ? status[status.length - 1] : 'Not Send Yet';
            console.log('webhookStatus', webhookStatus);

            const status =
               webhookStatus.length > 0
                  ? webhookStatus?.map((status: any) => {
                       const data = {
                          status: convertStatus(status.status),
                          blastingSource: status.blastingSource,
                          lastUpdated: moment(status.lastUpdateStatus).format('DD/MM/YYYY HH:mm:ss'),
                       };

                       return data;
                    })
                  : convertStatus('');

            const lastUpdated =
               webhookStatus.length > 0
                  ? moment(webhookStatus[webhookStatus.length - 1].lastUpdateStatus).format('DD/MM/YYYY HH:mm:ss')
                  : ' - ';

            const statusCode = webhookStatus.length > 0 ? webhookStatus[webhookStatus.length - 1].statusCode : ' - ';

            const blastingSource =
               webhookStatus.length > 0 ? webhookStatus?.map((from: any) => from.blastingSource) : ' - ';

            return {
               name: guest.name,
               phoneNumber: guest.phoneNumber,
               qr_code: guest.qr_code,
               status: status,
               statusCode: statusCode,
               // broadcastStatus: formattedStatus(statusFiltered),
            };
         });

         setData(data);
      }
   }, [dashboardData]);

   const searchChange = (e: any) => {
      setGlobalFilter(e.target.value);
   };

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      onGlobalFilterChange: setGlobalFilter,
      state: {
         globalFilter,
         pagination,
      },
   });

   return (
      <>
         <div className="grid grid-cols-3 3md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-14">
            <div className="bg-sky-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboardData?.data?.map((data: any) => data.totalGuests)[0]}
               </h2>
               <h4 className="text-md font-semibold">Total Guest(s)</h4>
            </div>
            <div className="bg-lime-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboardData?.data?.map((data: any) => data.totalBroadcastSend)[0]}
               </h2>
               <h4 className="text-md font-semibold">Broadcast Sent</h4>
            </div>
            <div className="bg-amber-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboardData?.data?.map((data: any) => data.totalNotSendYet)[0]}
               </h2>
               <h4 className="text-md font-semibold">Pending Broadcast</h4>
            </div>
            <div className="bg-green-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboardData?.data?.map((data: any) => data.broadcastSuccess)[0]}
               </h2>
               <h4 className="text-md font-semibold">Broadcast Success</h4>
            </div>
            <div className="bg-red-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboardData?.data?.map((data: any) => data.broadcastFailed)[0]}
               </h2>
               <h4 className="text-md font-semibold">Broadcast Failed</h4>
            </div>
         </div>

         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Guest Data</h2>
            <input
               type="text"
               placeholder="Search"
               className="border-[1px] px-3 py-1 rounded-md"
               onChange={searchChange}
            />
         </div>

         <table className="border-[1px] w-full">
            <thead className="uppercase">
               {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                     {headerGroup.headers.map((header) => (
                        <th key={header.id} className="text-start h-10 px-4 py-2 bg-[#1c1c1c] text-white text-sm">
                           {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody>
               {data.length > 0 ? (
                  <>
                     {status === 'loading' ? (
                        <tr>
                           <td colSpan={columns.length} className="px-4 py-2 ">
                              <div className="flex items-center justify-center gap-2">
                                 <span className="loading loading-spinner loading-sm"></span> <span>Loading</span>
                              </div>
                           </td>
                        </tr>
                     ) : (
                        <>
                           {table.getRowModel().rows.map((row) => (
                              <tr key={row.id}>
                                 {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2 border-b-[1px] border-slate-300">
                                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                 ))}
                              </tr>
                           ))}
                        </>
                     )}
                  </>
               ) : status === 'loading' ? (
                  <tr>
                     <td colSpan={columns.length} className="px-4 py-2 ">
                        <div className="flex items-center justify-center gap-2">
                           <span className="loading loading-spinner loading-sm"></span> <span>Loading</span>
                        </div>
                     </td>
                  </tr>
               ) : (
                  <tr>
                     <td colSpan={columns.length} className="px-4 py-2 text-center">
                        No data
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
         <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
               <select
                  className="border-[1px] border-slate-900 px-3 py-2 rounded-md bg-transparent"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                     table.setPageSize(Number(e.target.value));
                  }}
               >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                     <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                     </option>
                  ))}
               </select>
               <span className="flex items-center gap-1">
                  | Go to page:
                  <input
                     type="number"
                     min="1"
                     max={table.getPageCount()}
                     defaultValue={table.getState().pagination.pageIndex + 1}
                     onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        table.setPageIndex(page);
                     }}
                     className="border p-1 rounded w-16"
                  />
               </span>
            </div>
            <div className="flex items-center gap-1">
               <button
                  className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-3 rounded-md transition duration-100 ease-in `}
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <ChevronDoubleLeftIcon className="size-3" />
               </button>
               <button
                  className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-4 py-3 rounded-md transition duration-100 ease-in `}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <ChevronLeftIcon className="size-3" />
               </button>
               <span className="flex items-center gap-1 mx-4 text-sm">
                  <div>Page</div>
                  <strong>
                     {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                  </strong>
               </span>
               <button
                  className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-4 py-3 rounded-md transition duration-100 ease-in `}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <ChevronRightIcon className="size-3" />
               </button>
               <button
                  className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-3 rounded-md transition duration-100 ease-in `}
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <ChevronDoubleRightIcon className="size-3" />
               </button>
            </div>
         </div>
      </>
   );
};
