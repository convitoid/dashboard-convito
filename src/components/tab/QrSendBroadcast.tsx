import { resetQrGuestsStatus } from '@/app/GlobalRedux/Features/clients/clientQrUploadGuestsSlice';
import { getQrGuests } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadGuestsThunk';
import { AppDispatch, RootState } from '@/app/store';
import {
   ColumnDef,
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
import Swal from 'sweetalert2';
import { sendQrBlasting } from '@/app/GlobalRedux/Thunk/sendBlasting/sendQrBlastingThunk';

type QrSendBroadcastProps = {
   clientId: string;
};

interface SelectedRows {
   [key: number]: boolean;
}

interface RowData {
   id: number;
   name: string;
   phoneNumber: string;
   qr_code: string;
}

export const QrSendBroadcast = ({ clientId }: QrSendBroadcastProps) => {
   const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');
   const [selectAll, setSelectAll] = useState(false);

   const dispatch = useDispatch<AppDispatch>();
   const qrGuests = useSelector((state: RootState) => state.clientQrUploadGuests.guests);
   const status = useSelector((state: RootState) => state.clientQrUploadGuests.status);
   const statusSend = useSelector((state: RootState) => state.sendQrBlasting.status);
   const [selectedRows, setSelectedRows] = useState<SelectedRows>({});

   const handleSelectAll = () => {
      setSelectAll((prev) => !prev);
      setSelectedRows((prev) =>
         data.reduce((acc, row) => {
            acc[row.id] = !selectAll;
            return acc;
         }, {} as SelectedRows)
      );
   };

   const handleRowSelect = (rowId: number) => {
      setSelectedRows((prev) => ({
         ...prev,
         [rowId]: !prev[rowId],
      }));
   };

   const getSelectedRowsData = () => {
      return data.filter((row) => selectedRows[row.id]);
   };

   useEffect(() => {
      dispatch(getQrGuests(clientId));

      return () => {
         dispatch(resetQrGuestsStatus());
      };
   }, [dispatch]);

   useEffect(() => {
      const columns: ColumnDef<RowData, any>[] = [
         {
            header: () => <input className="w-4 h-4" type="checkbox" onChange={handleSelectAll} checked={selectAll} />,
            accessorKey: 'validation',
            cell: ({ row }) => (
               <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={selectedRows[row.original.id] || false}
                  onChange={() => handleRowSelect(row.original.id)}
               />
            ),
         },
         {
            header: 'Guest Name',
            accessorKey: 'name',
         },
         {
            header: 'Phone Number',
            accessorKey: 'phoneNumber',
         },
         {
            header: 'Qr Code',
            accessorKey: 'qr_code',
         },
      ];

      setColumns(columns);

      if (qrGuests?.data?.length > 0) {
         const dynamicData = qrGuests.data.map((guest: any) => {
            return {
               id: guest.id,
               name: guest.name,
               phoneNumber: guest.phoneNumber,
               qr_code: guest.qr_code,
            };
         });

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
      };
   }, [qrGuests, selectAll, selectedRows]);

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

   const handleSendBroadcast = async () => {
      const data = getSelectedRowsData();

      if (data.length === 0) {
         Swal.fire({
            icon: 'info',
            title: 'Warning',
            text: 'Please select at least one guest',
         });
      } else {
         await dispatch(sendQrBlasting({ clientId, data }))
            .unwrap()
            .then((res) => {
               console.log('res', res);
               if (res.status === 200) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: res.message,
                  });
               } else {
                  Swal.fire({
                     icon: 'warning',
                     title: 'Error',
                     text: res.message,
                  });
               }
            });
      }
   };

   return (
      <>
         <button
            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 mb-5"
            onClick={handleSendBroadcast}
            disabled={statusSend === 'sending'}
         >
            {statusSend === 'sending' ? <span className="loading loading-spinner loading-sm"></span> : 'Send Broadcast'}
         </button>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Guests Data</h2>
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
