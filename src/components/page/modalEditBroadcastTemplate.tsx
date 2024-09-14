import { useDispatch, useSelector } from 'react-redux';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { useEffect, useState } from 'react';
import { resetData, resetStatus } from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';
import Swal from 'sweetalert2';
import {
   getAllBroadcastTemplates,
   updateBroadcastTemplate,
} from '@/app/GlobalRedux/Thunk/broadcastTemplate/broadcastTemplateThunk';

type ModalEditBroadcastTemplateProps = {
   modalId?: string;
   clientId?: any;
};

export const ModalEditBroadcastTemplate = ({ modalId, clientId }: ModalEditBroadcastTemplateProps) => {
   const [formData, setFormData] = useState<any>({
      id: '',
      template_name: '',
      template_type: '',
   });
   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.broadcastTemplate.status);
   const template = useSelector((state: RootState) => state.broadcastTemplate.data);

   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }
      dispatch(resetData());
   };

   const handleChange = (e: any) => {
      setFormData({ ...formData, template_name: e.target.value });
   };

   const handleSelectChange = (e: any) => {
      setFormData({ ...formData, template_type: e.target.value });
   };

   useEffect(() => {
      setFormData({
         template_name: template?.template_name ?? '',
         id: template?.id ?? '',
         template_type: template?.template_type ?? '',
      });

      return () => {
         dispatch(resetStatus());
      };
   }, [template]);

   const submitUpdateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formData.template_name === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill all fields!',
            target: document.getElementById(`${modalId}`),
         });
      }

      dispatch(updateBroadcastTemplate({ clientId, formData }))
         .unwrap()
         .then((res) => {
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Broadcast template updated successfully',
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  dispatch(getAllBroadcastTemplates(clientId));
                  dispatch(resetData());
                  dispatch(resetStatus());
                  setFormData({ template_name: '' });
                  closeModal();
               });
            }
         });
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Edit Broadcast Template"
         modalWrapper="p-0 w-full max-w-xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModal}
      >
         <form onSubmit={submitUpdateTemplate}>
            <div className="flex flex-col gap-2">
               <label htmlFor="question" className="text-[16px] font-semibold">
                  Template Name
               </label>
               <input
                  type="text"
                  name="template_name"
                  id="template_name"
                  placeholder="Input template name here"
                  className="border-[1px] border-gray-300 rounded-md px-3 py-2"
                  value={formData.template_name}
                  onChange={handleChange}
               />
            </div>
            <div className="flex flex-col gap-2">
               <label htmlFor="template_type" className="text-[16px] font-semibold">
                  Template Type
               </label>
               <select
                  name="template_type"
                  id="template_type"
                  onChange={handleSelectChange}
                  className="border-[1px] border-gray-300 rounded-md px-3 py-2"
                  value={formData.template_type}
               >
                  <option value="" disabled>
                     Select template type
                  </option>
                  <option value="no_header">No Header</option>
                  <option value="header_image">Header Image</option>
                  <option value="header_video">Header Video</option>
               </select>
            </div>
            <div className="flex items-center justify-end mt-3 gap-3">
               <button
                  type="button"
                  className="btn btn-md btn-ghost border-[1px] border-slate-900"
                  onClick={closeModal}
                  disabled={status === 'updateLoading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
                  disabled={status === 'updateLoading'}
               >
                  {status === 'addLoading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
