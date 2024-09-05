import { deleteQuestion, getAllQuestions, getQuestionById } from '@/app/GlobalRedux/Thunk/questions/questionThunk';
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
import { ChevronLeftIcon } from '../icons/chevronLeft';
import { ChevronRightIcon } from '../icons/chevronRight';
import { ChevronDoubleRightIcon } from '../icons/chevronDoubleRight';
import { ChevronDoubleLeftIcon } from '../icons/chevronDoubleLeft';
import { EditIcon } from '../icons/edit';
import { DeleteIcon } from '../icons/delete';
import { ModalAddQuestion } from '../page/modalAddQuestion';
import { ModalEditQuestion } from '../page/modalEditQuestion';
import {
   closeModalEditQuestionAction,
   openModalEditQuestionAction,
} from '@/app/GlobalRedux/Features/question/questionSlice';
import Swal from 'sweetalert2';

type QuestionTabProps = {
   clientId?: string;
};

export const QuestionTab = ({ clientId }: QuestionTabProps) => {
   const [columns, setColumns] = useState<any[]>([]);
   const [data, setData] = useState<any[]>([]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
   });
   const [globalFilter, setGlobalFilter] = useState('');
   const [questionId, setQuestionId] = useState('');

   const dispatch = useDispatch<AppDispatch>();
   const questions = useSelector((state: RootState) => state.questions.questions);
   const status = useSelector((state: RootState) => state.questions.status);
   const isModalEditQuestionOpen = useSelector((state: RootState) => state.questions.isModalEditQuestionOpen);

   useEffect(() => {
      dispatch(getAllQuestions(clientId?.toString() ?? ''));
   }, [dispatch]);

   const openMoldalAddQuestion = () => {
      (document.getElementById(`modalAddQuestion`) as HTMLDialogElement).showModal();
   };

   const openModalEditQuestion = (id: number) => {
      dispatch(openModalEditQuestionAction());
      dispatch(getQuestionById({ clientId: clientId ?? '', questionId: id.toString() }));
      setQuestionId(id.toString());
      (document.getElementById(`modalEditQuestion`) as HTMLDialogElement).showModal();
   };

   const deleteQuestionAction = (id: number) => {
      Swal.fire({
         text: "Are you sure you want to delete this question? You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            dispatch(deleteQuestion({ clientId: clientId ?? '', id: id.toString() }))
               .unwrap()
               .then((res) => {
                  console.log('res', res);
                  if (res.status === 200) {
                     console.log('masuk sini');
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success',
                     }).then(() => {
                        dispatch(getAllQuestions(clientId?.toString() ?? ''));
                     });
                  }
               });
         }
      });
   };

   useEffect(() => {
      if (questions.length > 0) {
         const dynamicColumns = [
            {
               header: 'No',
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1,
            },
            {
               header: 'Question',
               accessorKey: 'question',
               cell: (info: any) => <span dangerouslySetInnerHTML={{ __html: info.row.original.question }}></span>,
            },
            {
               header: 'Type',
               accessorKey: 'type',
            },
            {
               header: 'Position',
               accessorKey: 'position',
            },
            {
               header: 'Actions',
               accessorKey: 'actions',
               cell: (info: any) => {
                  return (
                     <div className="flex">
                        <button
                           className="btn bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold mr-2 tooltip tooltip-bottom"
                           data-tip="Edit"
                           onClick={() => openModalEditQuestion(info.row.original.id)}
                        >
                           <EditIcon />
                        </button>
                        <button
                           className="btn bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-100 ease-in text-[14px] font-semibold tooltip tooltip-bottom"
                           data-tip="Delete"
                           onClick={() => deleteQuestionAction(info.row.original.id)}
                        >
                           <DeleteIcon />
                        </button>
                     </div>
                  );
               },
            },
         ];

         setColumns(dynamicColumns);

         // format data raw html

         const dynamicData = questions.map((question: any) => {
            return {
               id: question.id,
               question: question.question,
               type: question.type,
               position: question.position,
            };
         });

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
         setGlobalFilter('');
      };
   }, [questions]);

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
            onClick={openMoldalAddQuestion}
         >
            Add question
         </button>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Question data</h2>
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
         <ModalAddQuestion modalId="modalAddQuestion" clientId={clientId ?? ''} />
         <ModalEditQuestion modalId="modalEditQuestion" clientId={clientId ?? ''} questionId={questionId} />
      </>
   );
};
