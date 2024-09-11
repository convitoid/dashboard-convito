import { useDispatch, useSelector } from 'react-redux';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { useEffect, useState } from 'react';
import {
   fetchQrBroadcastTemplate,
   updateQrBroadcastTemplate,
} from '@/app/GlobalRedux/Thunk/clients/clientQrBroadcastTemplate';
import {
   resetDataQrBroadcastTemplate,
   resetStatusQrBroadcastTemplate,
} from '@/app/GlobalRedux/Features/clients/clientQrBroadcastTemplateSlice';
import Swal from 'sweetalert2';

type ModalQrEditBroadcastTemplateProps = {
   modalId: string;
   clientId: string;
};

export const ModalQrEditBroadcastTemplate = ({ modalId, clientId }: ModalQrEditBroadcastTemplateProps) => {
   const [formData, setFormData] = useState({
      clientId: clientId,
      id: '',
      template_name: '',
      template_type: '',
   });

   const dispatch = useDispatch<AppDispatch>();
   const template = useSelector((state: RootState) => state.clientQrBroadcastTemplate.template);
   const status = useSelector((state: RootState) => state.clientQrBroadcastTemplate.status);

   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }

      dispatch(resetDataQrBroadcastTemplate());
      setFormData({
         clientId: clientId,
         id: '',
         template_name: '',
         template_type: '',
      });
   };

   useEffect(() => {
      template?.data?.QrBroadcastTemplate?.map((data: any) => {
         setFormData({
            ...formData,
            id: data.id,
            template_name: data.name,
            template_type: data.type,
         });
      });
   }, [template]);

   const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
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

      await dispatch(updateQrBroadcastTemplate(formData))
         .unwrap()
         .then((res) => {
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Broadcast template updated successfully',
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  closeModal();
                  dispatch(resetDataQrBroadcastTemplate());
                  dispatch(resetStatusQrBroadcastTemplate());
                  dispatch(fetchQrBroadcastTemplate({ clientId }));
               });
            } else {
               Swal.fire({
                  icon: res.status === 409 ? 'warning' : 'error',
                  title: 'Oops...',
                  text: res.message,
                  target: document.getElementById(`${modalId}`),
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
               <label htmlFor="template_type">Template type</label>
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
                  disabled={status === 'getDataLoading' || status === 'updateDataLoading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold"
                  disabled={status === 'getDataLoading' || status === 'updateDataLoading'}
               >
                  {status === 'getDataLoading' || status === 'updateDataLoading' ? (
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
