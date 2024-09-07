import { exportData, getDashboardData } from '@/app/GlobalRedux/Thunk/clients/clientDashboardThunk';
import { AppDispatch, RootState } from '@/app/store';
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { ExcelIcon } from '../icons/excel';
import { exportToExcel } from '@/utils/exportToExcel';

type DashboardTabProps = {
   clientId?: string;
};

export const DashboardTab = ({ clientId }: DashboardTabProps) => {
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('');
   const [filteredData, setFilteredData] = useState<any[]>([]);

   const dispatch = useDispatch<AppDispatch>();
   const dashboarData = useSelector((state: RootState) => state.clientDashboard.datas);
   const status = useSelector((state: RootState) => state.clientDashboard.status);

   useEffect(() => {
      dispatch(getDashboardData({ clientId: clientId?.toString() }));
   }, [dispatch]);

   useEffect(() => {
      if (dashboarData.length > 0) {
         const dynamicColumns = [
            {
               header: 'No',
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1,
            },
            {
               header: 'Guest ID',
               accessorKey: 'guestId',
            },
            {
               header: 'Name',
               accessorKey: 'name',
            },
            {
               header: 'Scenario',
               accessorKey: 'scenario',
            },
            {
               header: 'Answer',
               accessorKey: 'answer',
            },
            {
               header: 'Status Blasting',
               accessorKey: 'status_blasting',
               cell: (info: any) => {
                  return (
                     <span
                        className={`text-sm px-2 py-1 rounded-md ${
                           info.row.original.status_blasting === 'Success'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                        }`}
                     >
                        {info.row.original.status_blasting}
                     </span>
                  );
               },
            },
         ];

         setColumns(dynamicColumns);

         const dynamicData = dashboarData[0].guest.map((item: any, index: number) => {
            const answer = item.Invitations.some((invitation: any) => invitation.answer !== null);
            const statusBlasting = item.SendBlastingLogs.map((log: any) => log.status);

            console.log(statusBlasting);

            return {
               id: item.id,
               guestId: item.guestId,
               name: item.name,
               scenario: item.scenario,
               answer: answer ? 'Yes' : 'No',
               status_blasting: statusBlasting[0] === 'success_send_blasting' ? 'Success' : 'Failed',
            };
         });

         setData(dynamicData);
      }
   }, [dashboarData]);

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

   const handleFilterDataBySelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedScenario = e.target.value;
      console.log(selectedScenario);

      if (selectedScenario === 'all') {
         setGlobalFilter('');
         setSelectedFilter('');
      } else {
         setGlobalFilter(selectedScenario);
         setSelectedFilter(selectedScenario);
      }
   };

   useEffect(() => {
      const filter = table.getRowModel().rows.map((row) => row.original.id);
      setFilteredData(filter);
   }, [selectedFilter]);

   const handleExportToExcel = () => {
      const data = table.getRowModel().rows.map((row) => row.original.id);
      dispatch(exportData({ data: data, clientId: clientId?.toString() }))
         .unwrap()
         .then((res) => {
            if (res.status === 200) {
               exportToExcel(res.data, clientId?.toString());
            }
         });
   };
   // console.log(table.getRowModel().rows.map((row) => row.original.id));

   return (
      <div>
         <div className="grid grid-cols-3 3md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-14">
            <div className="bg-sky-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">{dashboarData.length > 0 ? dashboarData[0].total_guests : 0}</h2>
               <h4 className="text-md font-semibold">Total Guest</h4>
            </div>
            <div className="bg-green-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboarData.length > 0 ? dashboarData[0].answered_guest : 0}
               </h2>
               <h4 className="text-md font-semibold">Total Answered</h4>
            </div>
            <div className="bg-amber-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">
                  {dashboarData.length > 0 ? dashboarData[0].not_answered_guest : 0}
               </h2>
               <h4 className="text-md font-semibold">Total No Answered</h4>
            </div>
            <div className="bg-teal-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">{dashboarData.length > 0 ? dashboarData[0].guest_confirm : 0}</h2>
               <h4 className="text-md font-semibold">Total Guest Confirm</h4>
            </div>
            <div className="bg-red-500 p-4 rounded-md text-white mb-4">
               <h2 className="text-3xl font-semibold">{dashboarData.length > 0 ? dashboarData[0].guest_decline : 0}</h2>
               <h4 className="text-md font-semibold">Total Guest Decline</h4>
            </div>
         </div>
         <div className="flex justify-between mb-3">
            <h2 className="text-lg font-bold">Guest Data</h2>

            <div className="flex items-center gap-3">
               <span className="text-sm">Filter data : </span>
               <select
                  name="filter_data"
                  id="filter_data"
                  onChange={handleFilterDataBySelected}
                  className="select select-sm select-bordered"
                  value={selectedFilter || 'all'}
               >
                  <option value="" disabled>
                     Filtered answer
                  </option>
                  <option value="all">All</option>
                  <option value="yes">Answered</option>
                  <option value="no">Not Answered</option>
               </select>
               <input
                  type="text"
                  placeholder="Search"
                  className="border-[1px] px-3 py-1 rounded-md"
                  onChange={searchChange}
               />
               <button
                  className="bg-white hover:bg-slate-50 transition duration-100 ease-in p-[0.30rem] border-[1px] rounded-md tooltip tooltip-left"
                  data-tip="Export to Excel"
                  onClick={handleExportToExcel}
               >
                  <ExcelIcon height="1.3em" width="1.3em" />
               </button>
            </div>
         </div>
         {status === 'loading' ? (
            <div className="skeleton h-[20rem] w-full"></div>
         ) : data.length > 0 ? (
            <>
               <table className="border-[1px] w-full">
                  <thead className="uppercase">
                     {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                           {headerGroup.headers.map((header) => (
                              <th key={header.id} className="text-start h-10 px-4 py-2 bg-slate-800 text-white text-sm">
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                           ))}
                        </tr>
                     ))}
                  </thead>
                  <tbody>
                     {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                           {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="px-4 py-2 border-b-[1px] border-slate-300">
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                           ))}
                        </tr>
                     ))}
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
         ) : (
            <div className="text-center text-gray-500 border-2 border-dashed border-slate-400 h-[10rem] flex items-center justify-center">
               <span>No data found</span>
            </div>
         )}
      </div>
   );
};
