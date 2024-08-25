import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchGuests, uploadGuests } from '@/app/GlobalRedux/Thunk/guests/guestThunk';
import React, { useEffect, useState } from 'react';
import {
   useReactTable,
   getCoreRowModel,
   flexRender,
   ColumnDef,
   getPaginationRowModel,
   getFilteredRowModel,
} from '@tanstack/react-table';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import Swal from 'sweetalert2';

type DataTabProps = {
   clientId?: string;
};

export const DataTab = ({ clientId }: DataTabProps) => {
   const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const guests = useSelector((state: RootState) => state.guests.guests);
   const status = useSelector((state: RootState) => state.guests.status);
   const statusUpload = useSelector((state: RootState) => state.guests.statusGuestsUpload);

   useEffect(() => {
      dispatch(fetchGuests(clientId?.toString() ?? ''));
   }, [dispatch]);

   useEffect(() => {
      if (guests.length > 0) {
         const firstGuest = guests[0];
         const keys = Object.keys(firstGuest).filter(
            (key) => !['GuestDetail', 'createdAt', 'updatedAt', 'clientId', 'id'].includes(key)
         );
         const guestDetail = firstGuest.GuestDetail.map((detail: any) => detail.detail_key);

         const dynamicColumns = [
            {
               header: 'No', // Add "No" column
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1, // Calculate index + 1
            },
            ...keys.map((key) => ({
               header: key.charAt(0).toUpperCase() + key.slice(1),
               accessorKey: key,
            })),
         ];

         setColumns(dynamicColumns);

         guestDetail.forEach((detail: any) => {
            dynamicColumns.push({
               header: detail.charAt(0).toUpperCase() + detail.slice(1), // Capitalize header
               accessorKey: detail,
            });
         });

         const formattedData = guests.map((guest: any, index: any) => {
            const details = guest.GuestDetail.reduce((acc: any, detail: any) => {
               acc[detail.detail_key] = detail.detail_val;
               return acc;
            }, {});

            // add no to the dynamic columns

            return {
               ...guest,
               ...details,
            };
         });

         setData(formattedData);
      }

      return () => {
         setData([]);
         setColumns([]);
      };
   }, [guests]);

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
         pagination,
         globalFilter,
      },
   });

   const handleImportGuestData = () => {
      // open file upload dialog
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = 'file';
      fileInput.accept = '.XLSX';
      fileInput.click();

      fileInput.addEventListener('change', (e) => {
         const file = (e.target as HTMLInputElement).files?.[0];
         if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
               const result = e.target?.result;
               if (result) {
                  // dispatch import action
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('client_id', clientId as string);

                  dispatch(uploadGuests(formData))
                     .unwrap()
                     .then((res) => {
                        if (res.status === 201) {
                           Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Data guest has been imported',
                           }).then(() => {
                              dispatch(fetchGuests(clientId?.toString() ?? ''));
                           });
                        }
                     });
               }
            };
         }
      });
   };

   const handleDownloadTemplate = () => {
      // download template from public/template/guest_upload/guest_upload_template.xlsx
      const link = document.createElement('a');
      link.href = '/template/guest_upload/guest_upload_template.xlsx';
      link.download = 'guest_upload_template.xlsx';
      link.click();
   };

   return (
      <>
         <div className="mb-3 flex items-center gap-2">
            <button
               className="btn bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
               onClick={handleImportGuestData}
               disabled={statusUpload === 'loading'}
            >
               {statusUpload === 'loading' ? (
                  <div className="flex items-center gap-3">
                     <span className="loading loading-spinner loading-md"></span>
                     <span>Uploading...</span>
                  </div>
               ) : (
                  'Import Guest Data'
               )}
            </button>
            <button
               className="btn bg-sky-500 text-white px-5 py-3 rounded-md hover:bg-sky-600 transition duration-100 ease-in text-[14px] font-semibold"
               onClick={handleDownloadTemplate}
            >
               Download Template
            </button>
         </div>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Guests Data</h2>
            <input
               type="text"
               placeholder="Search"
               className="border-[1px] px-3 py-1 rounded-md"
               onChange={searchChange}
            />
         </div>
         {status === 'loading' ? (
            <div className="skeleton h-[20rem] w-full"></div>
         ) : data.length > 0 ? (
            <>
               <table
                  className="border-[1px] w-full"
                  {...{
                     style: {
                        width: '100%',
                     },
                  }}
               >
                  <thead className="uppercase">
                     {table.getHeaderGroups().map((headerGroup, index) => (
                        <tr key={index}>
                           {headerGroup.headers
                              .filter((header) => header.column.columnDef.header !== 'Scenario_slug')
                              .map((header, index) => (
                                 <th key={index} className="text-start h-10 px-4 py-2 bg-slate-800 text-white text-sm">
                                    {header.isPlaceholder
                                       ? null
                                       : flexRender(header.column.columnDef.header, header.getContext())}
                                 </th>
                              ))}
                        </tr>
                     ))}
                  </thead>
                  <tbody>
                     {table.getRowModel().rows.map((row, index) => (
                        <tr key={index}>
                           {row
                              .getVisibleCells()
                              .filter((cell) => cell.column.columnDef.header !== 'Scenario_slug')
                              .map((cell, index) => (
                                 <td key={index} className="px-4 py-2 border-b-[1px] border-slate-300">
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
      </>
   );
};
