import { resetDataFiles } from '@/app/GlobalRedux/Features/clients/clientQrUploadFileSlice';
import { getQrFiles, uploadQrFile } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadFileThunk';
import { AppDispatch, RootState } from '@/app/store';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

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

   const dispatch = useDispatch<AppDispatch>();
   const files = useSelector((state: RootState) => state.clientQrUploadFile.files);
   const status = useSelector((state: RootState) => state.clientQrUploadFile.status);

   const handleQrImageUpload = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.zip';

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

         await dispatch(uploadQrFile(data));
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

   useEffect(() => {
      if (files.length > 0) {
         const dynamicColumns = [
            {
               header: 'No',
               accessorKey: 'no',
               cell: (info: any) => info.row.index + 1,
            },
            {
               header: "File's Name",
               accessorKey: 'name',
            },
            {
               header: 'Code',
               accessorKey: 'code',
            },
            {
               header: 'Actions',
               accessorKey: 'actions',
               cell: (info: any) => {
                  return (
                     <div>
                        <button
                           className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 ease-in"
                           onClick={() => console.log(info.row.original)}
                        >
                           View
                        </button>
                     </div>
                  );
               },
            },
         ];

         setColumns(dynamicColumns);

         const dynamicData = files.map((file: any) => ({
            id: file.id,
            name: file.name,
            code: file.code,
         }));

         setData(dynamicData);
      }

      return () => {
         setColumns([]);
         setData([]);
      };
   }, []);

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
            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 ease-in"
            onClick={handleQrImageUpload}
         >
            Upload Qr Image
         </button>

         <div>
            <pre>{JSON.stringify(files, null, 2)}</pre>
         </div>
      </>
   );
};
