import {
   resetDataFiles,
   setIsOpenModal,
   setProgress,
} from '@/app/GlobalRedux/Features/clients/clientQrUploadFileSlice';
import { getQrFiles, uploadQrFile } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadFileThunk';
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
import Swal from 'sweetalert2';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { Eye } from '../icons/eye';
import { QrCode } from '../icons/qrCode';
import { ShowQrModal } from '../page/showQrModal';
import { resetStatusQr } from '@/app/GlobalRedux/Features/clients/clientQrUploadImageSlice';
import axios from 'axios';

type QrDataTabProps = {
   clientId: string;
};

export const QrDataTab = ({ clientId }: QrDataTabProps) => {
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');
   const [qrCode, setQrCode] = useState('');
   const [qrUrl, setQrUrl] = useState('');
   const [qrFileName, setQrFileName] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const files = useSelector((state: RootState) => state.clientQrUploadFile.files);
   const status = useSelector((state: RootState) => state.clientQrUploadFile.status);
   const progress = useSelector((state: RootState) => state.clientQrUploadFile.progress);

   const handleQrImageUpload = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.zip';
      input.style.display = 'none';

      input.onchange = async (e) => {
         const file = (e.target as HTMLInputElement)?.files?.[0];
         if (!file) {
            Swal.fire({
               icon: 'warning',
               title: 'Oops...',
               text: 'No file selected!',
            });
         }

         const data = new FormData();
         data.append('file', file as Blob);
         data.append('client_id', clientId);

         await dispatch(uploadQrFile(data))
            .unwrap()
            .then((res) => {
               if (res.status === 201) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: res.message,
                  }).then(() => {
                     dispatch(getQrFiles(clientId));
                  });
                  dispatch(resetStatusQr());
                  dispatch(resetDataFiles());
               } else {
                  Swal.fire({
                     icon: 'warning',
                     title: 'Oops...',
                     text: res.message,
                  });
               }
            });
      };

      document.body.appendChild(input);
      input.click();
   };

   useEffect(() => {
      dispatch(getQrFiles(clientId));

      return () => {
         dispatch(resetDataFiles());
      };
   }, [clientId, dispatch]);

   const showQrModal = async (data: any) => {
      const url = `/api/qr/render-image/${clientId}/${data.name}`;
      const response = await fetch(url);

      setQrCode(data.code);
      setQrUrl(response.url);
      setQrFileName(data.name);

      dispatch(setIsOpenModal());
      const modal = document.getElementById('showQrModal');
      if (modal) {
         (modal as HTMLDialogElement).showModal();
      }
   };

   useEffect(() => {
      const dynamicColumns = [
         {
            header: 'No',
            accessorKey: 'no',
            cell: (info: any) => info.row.index + 1,
         },
         {
            header: 'Code',
            accessorKey: 'code',
         },
         {
            header: 'File Name',
            accessorKey: 'name',
         },
         {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (info: any) => {
               return (
                  <div>
                     <button
                        className="btn bg-sky-500 text-white hover:bg-sky-600 transition duration-100 ease-in tooltip tooltip-bottom"
                        data-tip="View"
                        onClick={() => showQrModal(info.row.original)}
                     >
                        <QrCode className="size-5" />
                     </button>
                  </div>
               );
            },
         },
      ];

      setColumns(dynamicColumns);

      if (files?.length > 0) {
         const dynamicData = files.map((file: any) => ({
            id: file.id,
            name: file.name,
            code: file.code,
            path: file.path,
         }));

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
      };
   }, [files]);

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

      return () => {
         Swal.close();
      };
   }, [status]);

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
         <button
            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 ease-in mb-4"
            onClick={handleQrImageUpload}
            disabled={status === 'uploadLoading'}
         >
            {status === 'uploadLoading' ? (
               <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Please wait...</span>
               </>
            ) : (
               'Import Qr Data'
            )}
         </button>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Qr Data</h2>
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

         {status === 'success' && (
            <ShowQrModal modalId="showQrModal" code={qrCode} imgUrl={qrUrl} name={qrFileName} clientId={clientId} />
         )}
      </>
   );
};
