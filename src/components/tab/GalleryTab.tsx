import { useEffect, useState } from 'react';
import { ModalUploadImage } from '../page/modalUploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/app/GlobalRedux/Features/clients/clientUploadImageSlice';
import { RootState } from '@/app/store';

export const GalleryTab = () => {
   const dispatch = useDispatch();
   const isOpenModal = useSelector((state: RootState) => state.uploadImage.isOpenModal);

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

   return (
      <>
         <div>
            <h2 className="text-lg font-semibold mb-4">Client Gallery</h2>
            <button className="btn bg-blue-500 text-white" onClick={openModalUploadImage}>
               Upload image
            </button>
         </div>
         <ModalUploadImage modalId="modal_upload_image" title="Upload Image" />
      </>
   );
};
