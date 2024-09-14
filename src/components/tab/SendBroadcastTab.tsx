import { fetchGuests } from '@/app/GlobalRedux/Thunk/guests/guestThunk';
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
import { setSelectAllAction, setSelectedRowsAction } from '@/app/GlobalRedux/Features/sendBlasting/sendBlastingSlice';
import { sendBlasting } from '@/app/GlobalRedux/Thunk/sendBlasting/sendBlastingThunk';
import Swal from 'sweetalert2';

// Definisikan tipe data untuk baris
interface RowData {
   id: number;
   phone_number: string;
   name: string;
}

// Definisikan tipe untuk status checkbox
interface SelectedRows {
   [key: number]: boolean;
}

type SendBroadcastTabProps = {
   clientId?: string;
};

export const SendBroadcastTab = ({ clientId }: SendBroadcastTabProps) => {
   const [columns, setColumns] = useState<ColumnDef<RowData, any>[]>([]);
   const [data, setData] = useState<RowData[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');
   const [selectAll, setSelectAll] = useState(false);
   const [selectedRows, setSelectedRows] = useState<SelectedRows>({});
   const [selectedData, setSelectedData] = useState<RowData[]>([]);

   const dispatch = useDispatch<AppDispatch>();
   const guests = useSelector((state: RootState) => state.guests.guests);
   const statusGuest = useSelector((state: RootState) => state.guests.status);
   const sendingStatus = useSelector((state: RootState) => state.sendBlasting.status);

   useEffect(() => {
      dispatch(fetchGuests(clientId?.toString() ?? ''));
   }, [dispatch, clientId, selectAll, selectedRows]);

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

   useEffect(() => {
      if (guests?.length > 0) {
         const columns: ColumnDef<RowData, any>[] = [
            {
               header: () => (
                  <input className="w-4 h-4" type="checkbox" onChange={handleSelectAll} checked={selectAll} />
               ),
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
               header: 'Phone Number',
               accessorKey: 'phone_number',
            },
            {
               header: 'Name',
               accessorKey: 'name',
            },
            {
               header: 'Scenario',
               accessorKey: 'scenario',
               cell: (info) => {
                  return info
                     .getValue()
                     .replace(/-/g, ' ')
                     .toLowerCase()
                     .split(' ')
                     .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                     .join(' ');
               },
            },
         ];

         setColumns(columns);

         const formatedData: RowData[] = guests.map((guest: any) => {
            const details = guest.GuestDetail.reduce((acc: any, detail: any) => {
               acc[detail.detail_key] = detail.detail_val;
               return acc;
            }, {});

            return {
               id: guest.id,
               name: guest.name,
               phone_number: details.phone_number,
               scenario: details.scenario_slug,
            };
         });

         setData(formatedData);
      }

      return () => {
         setData([]);
         setColumns([]);
      };
   }, [guests]);

   const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
         pagination,
         globalFilter,
      },
   });

   const getSelectedRowsData = () => {
      return data.filter((row) => selectedRows[row.id]);
   };

   const handleSendBlasting = () => {
      const selectedRowsData = getSelectedRowsData();
      const checkboxItem = Object.keys(selectedRows).filter((key: any) => selectedRows[key]);

      if (checkboxItem.length === 0) {
         Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Please select at least one data',
         });
         return;
      }

      dispatch(sendBlasting({ clientId: clientId?.toString() ?? '', data: selectedRowsData }))
         .unwrap()
         .then((res) => {
            if (res.status === 200) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: res.message,
               });
            } else {
               Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: res.message,
               });
            }
         });
   };

   return (
      <>
         <button
            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 mb-5"
            onClick={handleSendBlasting}
            disabled={sendingStatus === 'sending'}
         >
            {sendingStatus === 'sending' ? (
               <span className="loading loading-spinner loading-sm"></span>
            ) : (
               'Send Broadcast'
            )}
         </button>
         <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">Broadcast Data</h1>
            <input
               type="text"
               placeholder="Search"
               className="border-[1px] px-3 py-1 rounded-md"
               onChange={searchChange}
            />
         </div>
         {statusGuest === 'loading' ? (
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
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
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
            'no data'
         )}
      </>
   );
};
