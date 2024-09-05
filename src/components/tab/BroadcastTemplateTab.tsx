import { useEffect, useState } from 'react';
import { ModalAddBroadcastTemplate } from '../page/modalAddBroadcastTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
   deleteBroadcastTemplate,
   getAllBroadcastTemplates,
   getBroadcastTemplateById,
} from '@/app/GlobalRedux/Thunk/broadcastTemplate/broadcastTemplateThunk';
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { resetStatus } from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';
import { EditIcon } from '../icons/edit';
import { DeleteIcon } from '../icons/delete';
import { ModalEditBroadcastTemplate } from '../page/modalEditBroadcastTemplate';
import Swal from 'sweetalert2';

type BroadcastTemplateTabProps = {
   clientId?: string;
};

export const BroadcastTemplateTab = ({ clientId }: BroadcastTemplateTabProps) => {
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const templates = useSelector((state: RootState) => state.broadcastTemplate.datas);
   const status = useSelector((state: RootState) => state.broadcastTemplate.status);

   useEffect(() => {
      dispatch(getAllBroadcastTemplates((clientId as string) ?? ''));
   }, [dispatch]);

   const openModal = () => {
      console.log('openModal');
      const modal = document.getElementById('ModalAddBroadcastTemplate');
      if (modal) {
         (modal as HTMLDialogElement).showModal();
      }
   };

   const openModalEdit = (id: number) => {
      const data = {
         id,
         clientId,
      };
      const modal = document.getElementById('ModalEditBroadcastTemplate');
      if (modal) {
         (modal as HTMLDialogElement).showModal();
      }

      dispatch(getBroadcastTemplateById(data));
   };

   const openModalDelete = (id: number) => {
      console.log('openModalDelete', id);
      const data = {
         id,
         clientId,
      };

      Swal.fire({
         text: "Are you sure you want to delete this template? You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            dispatch(deleteBroadcastTemplate(data))
               .unwrap()
               .then((res) => {
                  if (res.status === 200) {
                     dispatch(getAllBroadcastTemplates((clientId as string) ?? ''));
                     dispatch(resetStatus());
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your broadcast template has been deleted.',
                        icon: 'success',
                     });
                  } else {
                     Swal.fire({
                        title: 'Warning',
                        text: res.message,
                        icon: 'warning',
                     });
                  }
               });
         }
      });
   };

   useEffect(() => {
      if (templates?.length > 0) {
         const dynamicColumns = [
            {
               header: 'No',
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1,
            },
            {
               header: 'Template Name',
               accessorKey: 'template_name',
            },
            {
               header: 'Template Type',
               accessorKey: 'template_type',
            },
            {
               header: 'Actions',
               accessorKey: 'actions',
               cell: (info: any) => {
                  return (
                     <div className="flex items-center space-x-2">
                        <button
                           className="btn bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                           data-tip="Edit"
                           onClick={() => openModalEdit(info.row.original.id)}
                           disabled={status === 'deleteLoading'}
                        >
                           <EditIcon />
                        </button>
                        <button
                           className="btn bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                           data-tip="Delete"
                           onClick={() => openModalDelete(info.row.original.id)}
                           // onClick={() => console.log('delete', info.row.original.id)}
                           disabled={status === 'deleteLoading'}
                        >
                           {status === 'deleteLoading' ? (
                              <span className="loading loading-spinner loading-sm"></span>
                           ) : (
                              <DeleteIcon />
                           )}
                        </button>
                     </div>
                  );
               },
            },
         ];

         setColumns(dynamicColumns);

         const dynamicData = templates.map((template: any) => {
            return {
               id: template.id,
               template_name: template.template_name,
               template_type: template.template_type,
            };
         });

         setData(dynamicData);
      }

      return () => {
         dispatch(resetStatus());
      };
   }, [templates]);

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
         <ModalAddBroadcastTemplate modalId="ModalAddBroadcastTemplate" clientId={clientId} />
         <ModalEditBroadcastTemplate modalId="ModalEditBroadcastTemplate" clientId={clientId} />
      </>
   );
};
