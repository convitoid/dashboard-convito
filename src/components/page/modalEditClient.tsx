'use client';
import { useDispatch, useSelector } from 'react-redux';
import { FormIinput } from '../formInput';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { fetchClients, getClientById, updateClient } from '@/app/GlobalRedux/Thunk/clients/clientThunk';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { createValidation } from '@/utils/formValidation/user/createValidation';
import { createClientValidation } from '@/utils/formValidation/clients/createValidation';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

type ModalEditClientProps = {
   modalId?: string;
   clientId?: number | null;
   closeModal: () => void;
};

export const ModalEditClient = ({ modalId, clientId, closeModal }: ModalEditClientProps) => {
   const [formData, setFormData] = useState({
      id: 0,
      client_id: '',
      client_name: '',
      event_title: '',
      event_name: '',
      event_date: '',
      event_type: '',
      created_at: '',
      created_by: '',
   });
   const dispatch = useDispatch<AppDispatch>();
   const statusUpdate = useSelector((state: RootState) => state.clients.statusUpdate);
   const { data: session, status } = useSession();

   useEffect(() => {
      if (clientId) {
         dispatch(getClientById(clientId))
            .unwrap()
            .then((data) => {
               setFormData({
                  id: data.data.id,
                  client_id: data.data.client_id,
                  client_name: data.data.client_name,
                  event_title: data.data.event_title,
                  event_name: data.data.event_name,
                  event_date: data.data.event_date,
                  event_type: data.data.event_type,
                  created_at: data.data.createdAt,
                  created_by: data.data.createdBy,
               });
            });
      }
   }, [clientId, dispatch]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validation = createClientValidation(formData);

      if (Object.keys(validation).length > 0) {
         const key = Object.keys(validation)[0];
         const snakeCaseKey = key.replace('_', ' ');
         const camelCaseKey = snakeCaseKey.replace(/(\b\w)/gi, (m) => m.toUpperCase());

         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: `${camelCaseKey} is required`,
            target: document.getElementById(`${modalId}`),
         });
      }

      const newFormData = {
         ...formData,
         updated_by: session?.user?.name,
      };

      dispatch(updateClient(newFormData))
         .unwrap()
         .then((res) => {
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: res.message,
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  closeModal();
                  dispatch(fetchClients());
               });
            }
         });
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Edit Client"
         modalWrapper="p-0 w-11/12 max-w-xl"
         backgroundColorHeader="bg-yellow-400 px-6 py-5"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModal}
      >
         <form onSubmit={submitForm}>
            <FormIinput
               label="Client ID"
               inputName="client_id"
               inputType="text"
               placeholder="CL-0000"
               labelStyle="text-slate-900 font-semibold text-sm"
               inputStyle="input input-bordered h-10"
               value={formData.client_id}
               onChange={handleInputChange}
               disabled={true}
            />
            <div className="flex gap-2">
               <div className="mb-1 md:flex-grow">
                  <FormIinput
                     label="Created At"
                     inputName="event_date"
                     inputType="datetime-local"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     value={moment(formData.created_at).format('YYYY-MM-DDTHH:mm')}
                     onChange={handleInputChange}
                     autoFocus={false}
                     disabled={true}
                  />
               </div>
               <div className="mb-1 md:flex-grow">
                  <FormIinput
                     label="Created By"
                     inputName="created_by"
                     inputType="text"
                     placeholder="e.g. John Doe"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     value={formData.created_by}
                     onChange={handleInputChange}
                     autoFocus={false}
                     disabled={true}
                  />
               </div>
            </div>
            <div className="mb-1 md:flex-grow">
               <FormIinput
                  label="Event Title"
                  inputName="event_title"
                  inputType="text"
                  placeholder="e.g. John Doe"
                  labelStyle="text-slate-900 font-semibold text-sm"
                  inputStyle="input input-bordered h-10"
                  value={formData.event_title}
                  onChange={handleInputChange}
                  autoFocus={true}
               />
            </div>
            <div className="mb-1 md:flex-grow">
               <FormIinput
                  label="Event Name"
                  inputName="event_name"
                  inputType="text"
                  labelStyle="text-slate-900 font-semibold text-sm"
                  inputStyle="input input-bordered h-10"
                  placeholder="e.g. Wedding of John Doe"
                  value={formData.event_name}
                  onChange={handleInputChange}
                  autoFocus={false}
               />
            </div>
            <div className="mb-1 md:flex-grow">
               <FormIinput
                  label="Event Date"
                  inputName="event_date"
                  inputType="date"
                  labelStyle="text-slate-900 font-semibold text-sm"
                  inputStyle="input input-bordered h-10"
                  value={moment(formData.event_date).format('YYYY-MM-DD')}
                  onChange={handleInputChange}
                  autoFocus={false}
               />
            </div>
            <div className="mb-1 md:flex-grow">
               <FormIinput
                  label="Event Type"
                  inputName="event_type"
                  inputType="text"
                  labelStyle="text-slate-900 font-semibold text-sm"
                  inputStyle="input input-bordered h-10"
                  placeholder="e.g. Wedding, Birthday, etc."
                  value={formData.event_type}
                  onChange={handleInputChange}
                  autoFocus={false}
               />
            </div>
            <div className="flex items-center justify-end gap-1 mt-4">
               <button
                  className="btn bg-slate-300"
                  type="button"
                  onClick={closeModal}
                  disabled={statusUpdate === 'loading'}
               >
                  Cancel
               </button>
               <button
                  className="btn bg-yellow-400 hover:bg-yellow-500 text-slate-900 transition duration-100 ease-in"
                  disabled={statusUpdate === 'loading'}
               >
                  {statusUpdate === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Update'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
