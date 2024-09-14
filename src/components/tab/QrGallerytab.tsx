import { useDispatch, useSelector } from 'react-redux';
import { ModalQrUploadImage } from '../page/modalQrUploadImage';
import { AppDispatch, RootState } from '@/app/store';
import { useEffect, useState } from 'react';
import { deleteQrImage, getQrImages } from '@/app/GlobalRedux/Thunk/clients/clientQrUploadImageThunk';
import { Xicon } from '../icons/xicon';
import Image from 'next/image';
import Swal from 'sweetalert2';

type QrGallerytabProps = {
   clientId: string;
};

export const QrGallerytab = ({ clientId }: QrGallerytabProps) => {
   const [imgUrl, setImgUrl] = useState('');
   const dispatch = useDispatch<AppDispatch>();
   const images = useSelector((state: RootState) => state.clientQrUploadImage.datas);
   const status = useSelector((state: RootState) => state.clientQrUploadImage.status);

   useEffect(() => {
      dispatch(getQrImages(clientId));
   }, [dispatch]);

   const openModalUploadImage = () => {
      const modal = document.getElementById('modalQrUploadImage') as HTMLDialogElement;

      if (modal) {
         modal.showModal();
      }
   };

   const handleDeleteImage = async (imageId: number, clientId: string) => {
      await dispatch(deleteQrImage({ imageId, clientId }))
         .unwrap()
         .then((res) => {
            if (res.status === 200) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: res.message,
               }).then(() => {
                  dispatch(getQrImages(clientId));
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
            >
               Upload Image
            </button>
         </div>

         {status === 'loading' ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="skeleton h-80 w-full"></div>
            </div>
         ) : (
            <>
               {images?.data?.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                     {images?.data?.map((image: any, index: number) => (
                        <div className="relative" key={image.id}>
                           <div className="absolute right-0 top-0 -translate-x-2 translate-y-2">
                              <button
                                 className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors duration-100 ease-in tooltip tooltip-bottom"
                                 data-tip="Delete image"
                                 onClick={() => handleDeleteImage(image.id, clientId)}
                              >
                                 <Xicon className="size-5" />
                              </button>
                           </div>
                           <Image
                              src={image.imageUrl}
                              alt={image.name}
                              width={1000}
                              height={1000}
                              className="w-full rounded-md"
                              unoptimized
                           />
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

         <ModalQrUploadImage modalId="modalQrUploadImage" title="Upload image" clientId={clientId} />
      </>
   );
};
