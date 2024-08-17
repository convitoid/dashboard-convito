import { useEffect, useState } from 'react';
import { ModalUploadImage } from '../page/modalUploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/app/GlobalRedux/Features/clients/clientUploadImageSlice';
import { AppDispatch, RootState } from '@/app/store';
import { deleteImage, getClientImages } from '@/app/GlobalRedux/Thunk/clients/clientUploadImageThunk';
import Image from 'next/image';
import { Xicon } from '../icons/xicon';
import Swal from 'sweetalert2';
import { deleteDataImage } from '@/services/uploads/images/uploadClientImageService';

type GalleryTabProps = {
   clientId?: string;
};

export const GalleryTab = ({ clientId }: GalleryTabProps) => {
   const dispatch = useDispatch<AppDispatch>();
   const isOpenModal = useSelector((state: RootState) => state.uploadImage.isOpenModal);
   const images = useSelector((state: RootState) => state.uploadImage.clientImages);
   const status = useSelector((state: RootState) => state.uploadImage.statusClientImages);

   const openModalUploadImage = () => {
      dispatch(openModal());
   };

   useEffect(() => {
      if (isOpenModal) {
         const modal = document.getElementById('modal_upload_image') as HTMLDialogElement;

         if (modal) {
            modal.showModal();
         }
      }
   });

   useEffect(() => {
      dispatch(getClientImages(clientId?.[0]?.toString() ?? ''));
   }, []);

   const replaceString = (str: string) => {
      // example invitation_website
      return str.replace('_', ' ');
   };

   const handleDeleteImage = (imageId: string) => {
      console.log('imageId', imageId);
      Swal.fire({
         text: "Are you sure you want to delete this image? You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            dispatch(deleteImage(imageId))
               .unwrap()
               .then((response) => {
                  console.log('response', response);
                  dispatch(getClientImages(clientId?.[0]?.toString() ?? ''));
                  Swal.fire({
                     title: 'Deleted!',
                     text: 'Your file has been deleted.',
                     icon: 'success',
                  });
               });
         }
      });
   };

   return (
      <>
         <button
            className="btn bg-blue-500 text-white mb-4"
            onClick={openModalUploadImage}
            disabled={images.length === 2}
         >
            Upload image
         </button>
         <h2 className="text-lg font-semibold mb-2">Client Gallery</h2>

         {status === 'loading' ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="skeleton h-80 w-full"></div>
               <div className="skeleton h-80 w-full"></div>
            </div>
         ) : (
            <>
               {images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                     {images.map((image: any, index: number) => (
                        <div className="relative" key={image.id}>
                           <div className="absolute right-0 top-0 -translate-x-2 translate-y-2">
                              <button
                                 className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors duration-100 ease-in tooltip tooltip-bottom"
                                 data-tip="Delete image"
                                 onClick={() => handleDeleteImage(image.id)}
                              >
                                 <Xicon className="size-5" />
                              </button>
                           </div>
                           <Image
                              src={image.imagePath}
                              alt={image.imageName}
                              width={1000}
                              height={1000}
                              className="w-full rounded-md"
                           />
                           <div className="backdrop-blur-sm bg-white/40 absolute w-full bottom-0 left-0 h-12 flex items-center justify-center">
                              <h1 className="text-slate-900 capitalize">{replaceString(image.flag)}</h1>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="border-2 border-dashed border-slate-500 mt-4 flex items-center h-20">
                     <p className="text-center">No images found, please upload image</p>
                  </div>
               )}
            </>
         )}

         <ModalUploadImage modalId="modal_upload_image" title="Upload Image" clientId={clientId} />
      </>
   );
};
