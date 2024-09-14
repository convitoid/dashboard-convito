import { resetQrGuestsData, resetQrGuestsStatus } from '@/app/GlobalRedux/Features/clients/clientQrUploadGuestsSlice';
import { getQrGuests, uploadQrGuests } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadGuestsThunk';
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
import Swal from 'sweetalert2';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';

type QrDataGuestTabProps = {
   clientId: string;
};

export const QrDataGuestTab = ({ clientId }: QrDataGuestTabProps) => {
   const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const guests = useSelector((state: RootState) => state.clientQrUploadGuests.guests);
   const status = useSelector((state: RootState) => state.clientQrUploadGuests.status);

   useEffect(() => {
      dispatch(getQrGuests(clientId));

      return () => {
         dispatch(resetQrGuestsStatus());
         dispatch(resetQrGuestsData());
      };
   }, [dispatch]);

   useEffect(() => {
      const dynamicColumns = [
         {
            Header: 'No',
            accessorKey: 'no',
            cell: (info: any) => info.row.index + 1,
         },
         {
            Header: 'Guest Name',
            accessorKey: 'name',
         },
         {
            Header: 'Phone Number',
            accessorKey: 'phoneNumber',
         },
         {
            Header: 'QR Code',
            accessorKey: 'qr_code',
         },
      ];

      setColumns(dynamicColumns);

      if (guests?.data?.length > 0) {
         const dynamicData = guests.data.map((guest: any) => {
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
   }, [guests]);

   const searchChange = (e: any) => {
      setGlobalFilter(e.target.value);
   };

   const handleInputGuestData = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = 'file';
      fileInput.accept = '.XLSX';
      fileInput.style.display = 'none';
      fileInput.click();

      fileInput.addEventListener('change', (e) => {
         const file = (e.target as HTMLInputElement).files?.[0];

         if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
               const result = e.target?.result;

               if (result) {
                  const formData = new FormData();
                  formData.append('file', file as Blob);
                  formData.append('client_id', clientId);

                  dispatch(uploadQrGuests(formData))
                     .unwrap()
                     .then((res) => {
                        if (res.status === 201) {
                           Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Data imported successfully',
                           }).then(() => {
                              dispatch(getQrGuests(clientId));
                           });
                           dispatch(resetQrGuestsStatus());
                           dispatch(resetQrGuestsData());
                        } else {
                           Swal.fire({
                              icon: 'warning',
                              title: 'Oops...',
                              text: 'Data imported failed',
                           });
                        }
                     });
               }
            };
         }
      });
   };

   const handleDownloadTemplate = () => {
      const link = document.createElement('a');
      link.href = '/template/guest_upload/qr_data_template_example.xlsx';
      link.download = 'qr_data_template_example.xlsx';
      link.click();
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

   useEffect(() => {
      if (status === 'uploadLoading') {
         Swal.fire({
            text: 'Please wait, file is uploading...',
            didOpen: () => {
               Swal.showLoading();
            },

            allowEscapeKey: false,
            allowOutsideClick: false,
         });
      }

      // return () => {
      //    Swal.close();
      // };
   }, [status]);

   return (
      <>
         <div className="flex items-center gap-2 mb-5">
            <button
               className="btn bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
               onClick={handleInputGuestData}
               disabled={status === 'uploadLoading'}
            >
               {status === 'uploadLoading' ? (
                  <>
                     <span className="loading loading-spinner loading-sm"></span> <span>Uploading data...</span>
                  </>
               ) : (
                  'Import Guest Data'
               )}
            </button>
            <button
               className="btn bg-sky-500 text-white px-5 py-3 rounded-md hover:bg-sky-600 transition duration-100 ease-in text-[14px] font-semibold"
               onClick={handleDownloadTemplate}
               disabled={status === 'uploadLoading'}
            >
               Download Template
            </button>
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
