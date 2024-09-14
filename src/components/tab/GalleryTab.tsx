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
import { ModalAddVideo } from '../page/modalAddVideo';
import { deleteVideo, getAllVideo } from '@/app/GlobalRedux/Thunk/video/videoThunk';
import { clearData, resetStatus } from '@/app/GlobalRedux/Features/video/videoSlice';

type GalleryTabProps = {
   clientId?: string;
};

export const GalleryTab = ({ clientId }: GalleryTabProps) => {
   const dispatch = useDispatch<AppDispatch>();
   const isOpenModal = useSelector((state: RootState) => state.uploadImage.isOpenModal);
   const images = useSelector((state: RootState) => state.uploadImage.clientImages);
   const status = useSelector((state: RootState) => state.uploadImage.statusClientImages);
   const videos = useSelector((state: RootState) => state.video.videos);
   const statusVideo = useSelector((state: RootState) => state.video.status);

   const openModalUploadImage = () => {
      dispatch(openModal());
   };

   const openModalAddVideo = () => {
      const modal = document.getElementById('modal_add_video') as HTMLDialogElement;

      if (modal) {
         modal.showModal();
      }
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
      dispatch(getClientImages(clientId?.toString() ?? ''));
   }, []);

   useEffect(() => {
      dispatch(getAllVideo({ clientId: clientId }));

      return () => {
         dispatch(clearData());
         dispatch(resetStatus());
      };
   }, [dispatch]);

   const replaceString = (str: string) => {
      // example invitation_website
      return str.replace('_', ' ');
   };

   const handleDeleteImage = (imageId: string) => {
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
                  dispatch(getClientImages(clientId?.toString() ?? ''));
                  Swal.fire({
                     title: 'Deleted!',
                     text: 'Your file has been deleted.',
                     icon: 'success',
                  });
               });
         }
      });
   };

   const handleDeleteVideo = (videoId: string) => {
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
            dispatch(deleteVideo({ clientId: clientId, id: videoId }))
               .unwrap()
               .then((res) => {
                  if (res.status === 200) {
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success',
                     }).then(() => {
                        dispatch(getAllVideo({ clientId: clientId }));
                        dispatch(clearData());
                        dispatch(resetStatus());
                     });
                  }
               });
         }
      });
   };

   return (
      <>
         <div className="flex items-center gap-2">
            <button
               className="btn bg-blue-500 text-white mb-4 hover:bg-blue-600 transition duraion-100 ease-in"
               onClick={openModalUploadImage}
               disabled={
                  images?.length === 2 ||
                  (videos as any)?.filter((image: any) => image.flag === 'blasting_whatsapp').length
               }
            >
               Upload Image
            </button>
            <button
               className="btn bg-cyan-500 text-white mb-4 hover:bg-cyan-500 transition duraion-100 ease-in"
               onClick={openModalAddVideo}
               disabled={
                  videos?.length === 1 ||
                  images?.filter((image: any) => image.flag === 'blasting_whatsapp').length === 1
               }
            >
               Add Video
            </button>
         </div>

         <div className="mb-5">
            <h2 className="text-lg font-semibold mb-2">Client Images</h2>

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
                                 src={image.imageUrl}
                                 alt={image.imageName}
                                 width={1000}
                                 height={1000}
                                 className="w-full rounded-md"
                                 unoptimized
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
         </div>
         {statusVideo === 'loading' ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="skeleton h-80 w-full"></div>
            </div>
         ) : (
            <div>
               <h2 className="text-lg font-semibold mb-2">Client Video</h2>
               {videos?.length > 0 ? (
                  <>
                     <div className="grid grid-cols-2 gap-4">
                        {videos.length > 0
                           ? (videos as any[]).map((video: any, index: number) => (
                                <div className="relative rounded-md" key={index}>
                                   <div className="absolute right-0 top-0 -translate-x-2 translate-y-2 z-10">
                                      <button
                                         className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors duration-100 ease-in tooltip tooltip-bottom "
                                         data-tip="Delete video"
                                         onClick={() => handleDeleteVideo(video.id)}
                                      >
                                         <Xicon className="size-5" />
                                      </button>
                                   </div>
                                   <div className="backdrop-blur-sm bg-white/40 absolute w-full top-0 left-0 h-12 flex items-center justify-center">
                                      <h1 className="text-slate-900 capitalize">Blasting Whatsapp</h1>
                                   </div>
                                   <iframe
                                      src={video.video}
                                      allow="autoplay"
                                      width="100%"
                                      height={400}
                                      // className="w-full rounded-md h-full"
                                   ></iframe>
                                </div>
                             ))
                           : 'no data'}
                     </div>
                  </>
               ) : (
                  <div className="border-2 border-dashed border-slate-500 mt-4 flex items-center h-20">
                     <p className="text-center">No video found, please upload video</p>
                  </div>
               )}
            </div>
         )}

         <ModalUploadImage modalId="modal_upload_image" title="Upload Image" clientId={clientId} />
         <ModalAddVideo modalId="modal_add_video" clientId={clientId} />
      </>
   );
};
