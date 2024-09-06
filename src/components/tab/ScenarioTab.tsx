import { useEffect, useState } from 'react';
import { AddScenario } from '../form/addScenario';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { deleteScenario, getAllScenario } from '@/app/GlobalRedux/Thunk/scenario/scenarioThunk';
import { EditIcon } from '../icons/edit';
import { DeleteIcon } from '../icons/delete';
import {
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { ChevronLeftIcon } from '../icons/chevronLeft';
import {
   clearData,
   openAddForm,
   openEditForm,
   setIsAddScenario,
} from '@/app/GlobalRedux/Features/scenario/scenarioSlice';
import Swal from 'sweetalert2';
import { resetData, resetStatus } from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';

type ScenarioTabProps = {
   clientId?: string;
};

export const ScenarioTab = ({ clientId }: ScenarioTabProps) => {
   // const [isAddScenario, setIsAddScenario] = useState(false);
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const scenarios = useSelector((state: RootState) => state.scenario.datas);
   const status = useSelector((state: RootState) => state.scenario.status);
   const formStatus = useSelector((state: RootState) => state.scenario.formStatus);
   const isFormOpen = useSelector((state: RootState) => state.scenario.isAddScenario);

   useEffect(() => {
      dispatch(getAllScenario(clientId ?? ''));
   }, [dispatch]);

   const handleDeleteScenario = (id: string) => {
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
            dispatch(
               deleteScenario({
                  clientId: clientId ?? '',
                  data: {
                     id: id,
                  },
               })
            )
               .unwrap()
               .then((res) => {
                  console.log('res', res);
                  if (res.status === 200) {
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success',
                     }).then(() => {
                        dispatch(resetData());
                        dispatch(resetStatus());
                        dispatch(getAllScenario(clientId ?? ''));
                        setData([]);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        setGlobalFilter('');
                     });
                  } else {
                     Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                     });
                  }
               });
         }
      });
   };

   useEffect(() => {
      if (scenarios?.length > 0) {
         const dynamicColumns = [
            {
               header: 'No',
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1,
            },
            {
               header: 'Scenario Name',
               accessorKey: 'scenario_name',
               cell: (info: any) => {
                  return (
                     <div className="capitalize">
                        <span>{info.getValue()}</span>
                     </div>
                  );
               },
            },
            {
               header: 'Question',
               accessorKey: 'question',
               cell: (info: any) => {
                  return (
                     <div className="flex items-center space-x-2 uppercase">
                        {info.getValue().map((question: any, index: number) => (
                           <span key={question.id}>
                              {question.scenario_question}
                              {index < info.getValue().length - 1 && ','}
                           </span>
                        ))}
                     </div>
                  );
               },
            },
            {
               header: 'Broadcast Template',
               accessorKey: 'broadcast_template',
               cell: (info: any) => {
                  return (
                     <div className="flex items-center space-x-2">
                        {info.getValue().map((broadcastTemplate: any, index: number) => (
                           <span key={broadcastTemplate.id}>
                              {broadcastTemplate.broadcast_template_scenario}
                              {index < info.getValue().length - 1 && ','}
                           </span>
                        ))}
                     </div>
                  );
               },
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
                           onClick={() => {
                              dispatch(setIsAddScenario(true));
                              dispatch(openEditForm(info.row.original.id));
                           }}
                        >
                           <EditIcon />
                        </button>
                        <button
                           className="btn bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                           data-tip="Delete"
                           onClick={() => handleDeleteScenario(info.row.original.id)}
                        >
                           <DeleteIcon />
                        </button>
                     </div>
                  );
               },
            },
         ];

         setColumns(dynamicColumns);

         const dynamicData = scenarios.map((scenario: any) => {
            return {
               id: scenario.id,
               scenario_name: scenario.scenario_name,
               question: scenario.ScenarioQuestion,
               broadcast_template: scenario.ScenarioBroadcastTemplate,
            };
         });

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
      };
   }, [scenarios]);

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
      <div>
         <button
            className={`btn ${isFormOpen ? 'bg-slate-900 hover:bg-slate-950 text-white' : ' bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600'} transition duration-100 ease-in text-[14px] font-semibold mb-4`}
            onClick={() => {
               // setIsAddScenario(!isAddScenario);
               dispatch(setIsAddScenario(!isFormOpen));
               dispatch(openAddForm());
               dispatch(clearData());
            }}
         >
            {isFormOpen ? 'Back' : 'Add scenario'}
         </button>
         {isFormOpen ? (
            <AddScenario clientId={clientId} />
         ) : (
            <>
               <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold mb-2">Scenario data</h2>
                  <input
                     type="text"
                     placeholder="Search"
                     className="border-[1px] px-3 py-1 rounded-md"
                     onChange={searchChange}
                  />
               </div>

               {status === 'loading' ? (
                  <div className="skeleton h-[20rem] w-full"></div>
               ) : data?.length > 0 ? (
                  <>
                     <table className="border-[1px] w-full">
                        <thead className="uppercase">
                           {table.getHeaderGroups().map((headerGroup) => (
                              <tr key={headerGroup.id}>
                                 {headerGroup.headers.map((header) => (
                                    <th
                                       key={header.id}
                                       className="text-start h-10 px-4 py-2 bg-slate-800 text-white text-sm"
                                    >
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
            </>
         )}
      </div>
   );
};
