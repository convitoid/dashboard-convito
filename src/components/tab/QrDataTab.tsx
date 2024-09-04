import { uploadQrFile } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadFileThunk';
import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

type QrDataTabProps = {
   clientId: string;
};

export const QrDataTab = ({ clientId }: QrDataTabProps) => {
   const dispatch = useDispatch<AppDispatch>();

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

   return (
      <>
         <button
            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-100 ease-in"
            onClick={handleQrImageUpload}
         >
            Upload Qr Image
         </button>

         <div></div>
      </>
   );
};
