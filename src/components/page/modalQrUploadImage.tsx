import { useEffect, useRef, useState } from 'react';
import { ModalComponent } from '../modal';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { getQrImages, uploadQrImage } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadImageThunk';
import { resetStatusQr } from '@/app/GlobalRedux/Features/clients/clientQrUploadImageSlice';

type ModalQrUploadImageProps = {
   modalId: string;
   title: string;
   clientId: string;
};

export const ModalQrUploadImage = ({ modalId, title, clientId }: ModalQrUploadImageProps) => {
   const [uploadProgress, setUploadProgress] = useState(0);
   const [isLoadingUpload, setIsLoadingUpload] = useState(false);
   const [uploadImageUrl, setUploadImageUrl] = useState('');
   const [uploadImageName, setUploadImageName] = useState('');
   const [uploadImageSize, setUploadImageSize] = useState(0);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const dispatch = useDispatch<AppDispatch>();
   const loading = useSelector((state: RootState) => state.clientQrUploadImage.status);

   const closeModal = () => {
      const modal = document.getElementById(modalId) as HTMLDialogElement;

      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }

      if (modal) {
         modal.close();
      }

      setIsLoadingUpload(false);
      setUploadProgress(0);
      setUploadImageUrl('');
   };

   const handelImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            setIsLoadingUpload(true);

            const uploadSimulation = setInterval(() => {
               setUploadProgress((prevProgress) => {
                  if (prevProgress >= 100) {
                     clearInterval(uploadSimulation);
                     setIsLoadingUpload(false);
                     if (e.target && typeof e.target.result === 'string') {
                        setUploadImageUrl(e.target.result);
                     }
                     setUploadImageName(file.name);
                     const convertToMb = (file.size / 1024 / 1024).toFixed(2);
                     setUploadImageSize(parseFloat(convertToMb));

                     return 100;
                  }
                  return prevProgress + 10;
               });
            }, 200);
         };

         reader.readAsDataURL(file);
      }
   };

   const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData();
      data.append('client_image', fileInputRef.current?.files?.[0] as Blob);
      data.append('client_id', clientId);

      if (!uploadImageUrl) {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please upload an image',
            target: document.getElementById(modalId),
         });
      }

      try {
         await dispatch(uploadQrImage(data))
            .unwrap()
            .then((res) => {
               if (res.status === 200) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Image uploaded successfully',
                     target: document.getElementById(modalId),
                  }).then(() => {
                     closeModal();
                     dispatch(resetStatusQr());
                     dispatch(getQrImages(clientId));
                  });
               }
            });
         // closeModal();
      } catch (error) {
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to upload image',
            target: document.getElementById(modalId),
         });
      }
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader={title}
         modalWrapper="p-0 w-11/12 max-w-xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModal}
      >
         <form onSubmit={submitForm}>
            <div className="mb-3">
               <label htmlFor="uploadImage" className="label font-semibold">
                  Upload Image
               </label>
               <input
                  ref={fileInputRef}
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={handelImageUpload}
               />
            </div>

            {isLoadingUpload && (
               <>
                  <progress className="progress progress-info w-full" value={uploadProgress} max="100"></progress>
                  <div className="flex items-center justify-between">
                     <span className="m-0">Uploading image...</span>
                     <span>{uploadProgress}%</span>
                  </div>
               </>
            )}

            {uploadImageUrl && (
               <div className="mb-6">
                  <Image
                     src={uploadImageUrl}
                     width={800}
                     height={800}
                     alt="preview"
                     className="w-full mb-1 rounded-md"
                  />
                  <div className="flex items-center justify-between px-1 mt-2">
                     <span className="text-sm">
                        <strong>Filename:</strong> <span className="italic">{uploadImageName}</span>
                     </span>
                     <span className="text-sm">
                        <strong>Size:</strong> <span className="italic">{uploadImageSize} MB</span>
                     </span>
                  </div>
               </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-2 border-t-[1px] border-slate-300 pt-3">
               <button
                  type="button"
                  className="btn btn-neutral"
                  disabled={isLoadingUpload || loading === 'loading'}
                  onClick={closeModal}
               >
                  Cancel
               </button>
               <button className="btn bg-blue-500 text-white" disabled={isLoadingUpload || loading === 'loading'}>
                  {loading === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
