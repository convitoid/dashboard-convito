import React, { useState } from 'react';
import { ModalComponent } from '../modal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
   createBroadcastTemplate,
   getAllBroadcastTemplates,
} from '@/app/GlobalRedux/Thunk/broadcastTemplate/broadcastTemplateThunk';
import { resetData, resetStatus } from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';

type ModalAddBroadcastTemplateProps = {
   modalId?: string;
   clientId?: any;
};

export const ModalAddBroadcastTemplate = ({ clientId, modalId }: ModalAddBroadcastTemplateProps) => {
   const [formData, setFormData] = useState<any>({
      template_name: '',
      template_type: '',
   });

   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.broadcastTemplate.status);

   const handleChange = (e: any) => {
      setFormData({ ...formData, template_name: e.target.value });
   };

   const handleSelectChange = (e: any) => {
      console.log(e.target.value);
      setFormData({ ...formData, template_type: e.target.value });
   };

   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }
      setFormData({ template_name: '', template_type: '' });
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formData.template_name === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill all fields!',
            target: document.getElementById(`${modalId}`),
         });
      }

      dispatch(createBroadcastTemplate({ clientId, formData }))
         .unwrap()
         .then((res) => {
            console.log(res);
            if (res.status !== 400) {
               Swal.fire({
                  icon: 'warning',
                  title: 'Oops...',
                  text: res.message,
                  target: document.getElementById(`${modalId}`),
               });
            }

            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: res.message,
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
         modalHeader="Add Broadcast Template"
         modalWrapper="p-0 w-full max-w-xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModal}
      >
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
               <label htmlFor="template_name" className="text-[16px] font-semibold">
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
                  disabled={status === 'addLoading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
                  disabled={status === 'addLoading'}
               >
                  {status === 'addLoading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
