import { useEffect, useRef, useState } from 'react';
import { ModalComponent } from '../modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { closeModal } from '@/app/GlobalRedux/Features/clients/clientUploadImageSlice';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { getClientImages, uploadImage } from '@/app/GlobalRedux/Thunk/clients/clientUploadImageThunk';

type ModalUploadImageProps = {
   modalId?: string;
   title: string;
   clientId?: string;
};

export const ModalUploadImage = ({ modalId, title, clientId }: ModalUploadImageProps) => {
   const [formData, setFormData] = useState({
      imageFlag: '',
   });
   const [uploadProgress, setUploadProgress] = useState(0);
   const [isLoadingUpload, setIsLoadingUpload] = useState(false);
   const [uploadImageUrl, setUploadImageUrl] = useState('');
   const [uploadImageName, setUploadImageName] = useState('');
   const [uploadImageSize, setUploadImageSize] = useState(0);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.uploadImage.status);

   const closeModalUploadImage = () => {
      const modal = document.getElementById(modalId ?? '') as HTMLDialogElement;

      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }

      if (modal) {
         modal.close();
      }

      dispatch(closeModal());
      setIsLoadingUpload(false);
      setUploadProgress(0);
      setUploadImageUrl('');
      setFormData({ imageFlag: '' });
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
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

   useEffect(() => {
      // detect escape key, close modal
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            closeModalUploadImage();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      setFormData({ imageFlag: '' });
   }, []);

   const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData();
      data.append('image_flag', formData.imageFlag);
      data.append('client_image', fileInputRef.current?.files?.[0] as Blob);
      data.append('client_code', clientId?.toString() ?? '');
      data.append('client_id', clientId?.toString() ?? '');

      if (formData.imageFlag === '') {
         Swal.fire({
            icon: 'info',
            title: 'Error',
            text: 'Please select image type',
            target: document.getElementById(modalId ?? ''),
         });
         return;
      }

      if (!uploadImageUrl) {
         Swal.fire({
            icon: 'info',
            title: 'Error',
            text: 'Please upload image',
            target: document.getElementById(modalId ?? ''),
         });
         return;
      }

      try {
         await dispatch(uploadImage(data))
            .unwrap()
            .then((res) => {
               if (res.status === 400) {
                  Swal.fire({
                     icon: 'warning',
                     text: res.error,
                     target: document.getElementById(modalId ?? ''),
                  });
               }

               if (res.status === 201) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Image uploaded successfully',
                     target: document.getElementById(modalId ?? ''),
                  }).then(() => {
                     dispatch(getClientImages(clientId?.toString() ?? ''));
                     closeModalUploadImage();
                  });
               }
            });
      } catch (error) {
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to upload image',
            target: document.getElementById(modalId ?? ''),
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
         closeModal={closeModalUploadImage}
      >
         <form onSubmit={submitForm}>
            <div className="mb-3">
               <label htmlFor="imageFlag" className="label font-semibold mb-1">
                  Image type
               </label>
               <select
                  name="imageFlag"
                  id="image_flag"
                  className="select select-bordered w-full"
                  value={formData.imageFlag}
                  onChange={handleInputChange}
               >
                  <option disabled value="">
                     Select image type
                  </option>
                  <option value="invitation_website">Invitation website</option>
                  <option value="blasting_whatsapp">Blasting whatsapp</option>
               </select>
            </div>
            <div className="flex flex-col mb-5">
               <label htmlFor="" className="label font-semibold">
                  Upload image
               </label>
               <input
                  ref={fileInputRef}
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/png, image/jpg, image/jpeg, image/PNG, image/JPG, image/JPEG"
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
                        <strong>Size:</strong> <span className="italic">{uploadImageSize}</span>
                     </span>
                  </div>
               </div>
            )}
            <div className="flex items-center justify-end gap-2 mt-2 border-t-[1px] border-slate-300 pt-3">
               <button
                  type="button"
                  className="btn btn-neutral"
                  disabled={isLoadingUpload || status === 'loading'}
                  onClick={closeModalUploadImage}
               >
                  Cancel
               </button>
               <button className="btn bg-blue-500 text-white" disabled={isLoadingUpload || status === 'loading'}>
                  {status === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
