import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { QrModalAddBroadcastTemplate } from '../page/modalQrAddBrodcastTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
   deleteQrBroadcastTemplate,
   fetchQrBroadcastTemplate,
   getQrBroadcastTemplateById,
} from '@/app/GlobalRedux/Thunk/clients/clientQrBroadcastTemplate';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { EditIcon } from '../icons/edit';
import { DeleteIcon } from '../icons/delete';
import { ModalQrEditBroadcastTemplate } from '../page/modalQrEditBroadcastTemplate';
import Swal from 'sweetalert2';
import {
   resetDataQrBroadcastTemplate,
   resetStatusQrBroadcastTemplate,
} from '@/app/GlobalRedux/Features/clients/clientQrBroadcastTemplateSlice';
import { getQrImages } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadImageThunk';
import { Xicon } from '../icons/xicon';
import { info } from 'console';

type QrBroadcastTemplateTabProps = {
   clientId: string;
};

export const QrBroadcastTemplateTab = ({ clientId }: QrBroadcastTemplateTabProps) => {
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const templates = useSelector((state: RootState) => state.clientQrBroadcastTemplate.templates);
   const status = useSelector((state: RootState) => state.clientQrBroadcastTemplate.status);
   const images = useSelector((state: RootState) => state.clientQrUploadImage.datas);

   useEffect(() => {
      dispatch(fetchQrBroadcastTemplate({ clientId }));
      dispatch(getQrImages(clientId));
   }, [dispatch]);

   const openModalEdit = (templateId: string) => {
      const modal = document.getElementById('ModalQrEditBroadcastTemplate');
      if (modal) {
         (modal as HTMLDialogElement).showModal();
      }

      dispatch(getQrBroadcastTemplateById({ clientId, templateId }));
   };

   const deleteTemplate = async (templateId: string) => {
      Swal.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            dispatch(deleteQrBroadcastTemplate({ clientId, templateId }))
               .unwrap()
               .then((res) => {
                  if (res.status === 200) {
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your broadcast template has been deleted.',
                        icon: 'success',
                     });

                     dispatch(fetchQrBroadcastTemplate({ clientId }));
                     dispatch(resetDataQrBroadcastTemplate());
                     dispatch(resetStatusQrBroadcastTemplate());
                  } else {
                     Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message,
                     });
                  }
               });
         }
      });
   };

   useEffect(() => {
      const dynamicColumns = [
         {
            header: 'No',
            accessorKey: 'no',
            cell: (info: any) => info.row.index + 1,
         },
         {
            header: 'Template Name',
            accessorKey: 'name',
         },
         {
            header: 'Template Type',
            accessorKey: 'type',
            cell: (info: any) => {
               if (info.row.original.type === 'reminder_template') {
                  return <span>Reminder Template</span>;
               } else {
                  return <span>Qr Template</span>;
               }
            },
         },
         {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (info: any) => (
               <div className="flex items-center space-x-2">
                  <button
                     className="btn bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                     data-tip="Edit"
                     onClick={() => openModalEdit(info.row.original.id)}
                  >
                     <EditIcon className="size-4" />
                  </button>
                  <button
                     className="btn bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                     data-tip="Delete"
                     onClick={() => deleteTemplate(info.row.original.id)}
                  >
                     <DeleteIcon className="size-4" />
                  </button>
               </div>
            ),
         },
      ];

      setColumns(dynamicColumns);

      if (templates?.data?.QrBroadcastTemplate?.length > 0) {
         const dynamicData = templates.data.QrBroadcastTemplate.map((item: any) => {
            return {
               id: item.id,
               name: item.name,
               type: item.type,
            };
         });

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
      };
   }, [templates]);

   const openModal = () => {
      const modal = document.getElementById('ModalQrAddBroadcastTemplate');
      if (modal) {
         (modal as HTMLDialogElement).showModal();
      }
   };

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
         {images?.data?.length === 0 && (
            <div role="alert" className="alert alert-warning mb-4 px-4 py-2">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
               </svg>
               <span className="text-[13px]">
                  Warning: You have not uploaded an image in the gallery tab. Please ensure that you use a reminder
                  broadcast template without an image. If you use the wrong broadcast template, the broadcast message
                  will not be sent.
               </span>
            </div>
         )}
         <button
            className="btn bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold mb-4"
            onClick={() => openModal()}
         >
            Add Broadcast Template
         </button>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Broadcast Template Data</h2>
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

         <QrModalAddBroadcastTemplate modalId="ModalQrAddBroadcastTemplate" clientId={clientId} />
         <ModalQrEditBroadcastTemplate modalId="ModalQrEditBroadcastTemplate" clientId={clientId} />
      </>
   );
};
