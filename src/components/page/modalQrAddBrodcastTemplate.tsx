import React, { useState } from 'react';
import { ModalComponent } from '../modal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
   createQrBroadcastTemplate,
   fetchQrBroadcastTemplate,
   getQrBroadcastTemplateById,
} from '@/app/GlobalRedux/Thunk/clients/clientQrBroadcastTemplate';
import { resetStatusQrBroadcastTemplate } from '@/app/GlobalRedux/Features/clients/clientQrBroadcastTemplateSlice';

type QrModalAddBroadcastTemplateProps = {
   modalId: string;
   clientId: string;
};

export const QrModalAddBroadcastTemplate = ({ modalId, clientId }: QrModalAddBroadcastTemplateProps) => {
   const [formData, setFormData] = useState<any>({
      template_name: '',
      template_type: '',
   });

   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.clientQrBroadcastTemplate.status);

   const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }

      setFormData({ template_name: '', template_type: '' });
   };

   const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formData.template_name === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill all fields!',
            target: document.getElementById(`${modalId}`),
         });
      }

      await dispatch(createQrBroadcastTemplate({ clientId, formData }))
         .unwrap()
         .then((res) => {
            console.log(res);
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Broadcast template created successfully',
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  closeModal();
                  dispatch(resetStatusQrBroadcastTemplate());
                  dispatch(fetchQrBroadcastTemplate({ clientId }));
               });
            } else {
               Swal.fire({
                  icon: res.status === 409 ? 'warning' : 'error',
                  title: 'Oops...',
                  text: res.message,
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  dispatch(resetStatusQrBroadcastTemplate());
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
         <form onSubmit={submitForm}>
            <div className="flex flex-col gap-2 mb-4">
               <label htmlFor="">Template Name</label>
               <input
                  type="text"
                  name="template_name"
                  id="template_name"
                  className="border-[1px] border-gray-300 rounded-md px-3 py-2"
                  placeholder="Input template name here"
                  value={formData.template_name}
                  onChange={handleChangeInput}
               />
            </div>
            <div className="flex flex-col gap-2 mb-4">
               <label htmlFor="template_type">Template Type</label>
               <select
                  name="template_type"
                  id="template_type"
                  className="border-[1px] border-gray-300 rounded-md px-3 py-2"
                  value={formData.template_type}
                  onChange={handleChangeSelect}
               >
                  <option value="" disabled>
                     Select Template Type
                  </option>
                  <option value="reminder_template">Reminder Template</option>
                  <option value="qr_template">QR Template</option>
               </select>
            </div>
            <div className="flex items-center justify-end mt-3 gap-3">
               <button
                  type="button"
                  className="btn btn-md btn-ghost border-[1px] border-slate-900"
                  onClick={closeModal}
                  disabled={status === 'createDataLoading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
                  disabled={status === 'createDataLoading'}
               >
                  {status === 'createDataLoading' ? (
                     <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                     'Submit'
                  )}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
