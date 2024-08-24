import { useState } from 'react';
import { ModalComponent } from '../modal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { createVideo, getAllVideo } from '@/app/GlobalRedux/Thunk/video/videoThunk';
import { clearData, resetStatus } from '@/app/GlobalRedux/Features/video/videoSlice';

type ModalAddVideoProps = {
   clientId?: string;
   modalId?: string;
};

export const ModalAddVideo = ({ clientId, modalId }: ModalAddVideoProps) => {
   const [formData, setFormData] = useState({
      video: '',
      flag: 'blasting_whatsapp',
   });

   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.video.status);

   const closeModalAddVideo = () => {
      const modal = document.getElementById(`${modalId}`) as HTMLDialogElement;
      if (modal) {
         modal.close();
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const submitVideo = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // check if video url is valid
      if (formData.video === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Video URL is required',
            target: document.getElementById('modal_add_video') as HTMLElement,
         });
      }

      dispatch(createVideo({ clientId: clientId?.toString() ?? '', data: formData }))
         .unwrap()
         .then((res) => {
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Video added successfully',
                  target: document.getElementById('modal_add_video') as HTMLElement,
               }).then(() => {
                  dispatch(resetStatus());
                  dispatch(getAllVideo({ clientId: clientId?.toString() ?? '' }));
                  dispatch(clearData());

                  closeModalAddVideo();
               });
            } else {
               Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong',
                  target: document.getElementById('modal_add_video') as HTMLElement,
               });
            }
         });
   };
   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Add Video"
         modalWrapper="p-0 w-11/12 max-w-xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModalAddVideo}
      >
         <form onSubmit={submitVideo}>
            <div className="flex flex-col gap-2">
               <label htmlFor="video" className="text-[14px] font-semibold">
                  Video URL
               </label>
               <input
                  type="text"
                  name="video"
                  id="video"
                  placeholder="Input your video url"
                  className="input input-md input-bordered"
                  onChange={handleChange}
               />
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
               <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={closeModalAddVideo}
                  disabled={status === 'loading'}
               >
                  Cancel
               </button>
               <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600 duration-100 ease-in"
                  disabled={status === 'loading'}
               >
                  {status === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
