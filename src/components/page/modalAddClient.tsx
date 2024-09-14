'use client';

import React, { useState } from 'react';
import { FormIinput } from '../formInput';
import { PlusCircleIcon } from '../icons/plusCircle';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { createCLient, fetchClients } from '@/app/GlobalRedux/Thunk/clients/clientThunk';
import { createClientValidation } from '@/utils/formValidation/clients/createValidation';

type ModalAddClientProps = {
   modalId?: string;
   title?: string;
};

export const ModalAddClient = ({ modalId, title }: ModalAddClientProps) => {
   const [formData, setFormData] = useState({
      client_name: '',
      event_title: '',
      event_name: '',
      event_date: '',
      event_type: '',
   });

   const { data: session } = useSession();
   const dispatch = useDispatch<AppDispatch>();
   const statusClient = useSelector((state: RootState) => state.clients.statusAdd);

   const handleSubmitClient = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validation = createClientValidation(formData);

      if (Object.keys(validation).length > 0) {
         const key = Object.keys(validation)[0];
         // delete _ from key and convert to snake case
         const snakeCaseKey = key.replace('_', ' ');
         // convert to Camel case
         const camelCaseKey = snakeCaseKey.replace(/(\b\w)/gi, (m) => m.toUpperCase());

         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: `${camelCaseKey} is required`,
            target: document.getElementById(`${modalId}`),
         });
      }

      formData.event_date = new Date(formData.event_date).toISOString();

      let newFormData = {
         ...formData,
         updatedBy: session?.user?.name,
         createdBy: session?.user?.name,
      };

      const createClient = await dispatch(createCLient(newFormData));

      if (createClient.payload.status !== 201) {
         return Swal.fire({
            icon: 'info',
            title: 'Error',
            text: 'Failed to create client',
            target: document.getElementById(`${modalId}`),
         });
      }

      Swal.fire({
         icon: 'success',
         title: 'Success',
         text: 'Client created successfully',
         target: document.getElementById(`${modalId}`),
      }).then(() => {
         dispatch(fetchClients());
         closeModal();
      });
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const openModal = () => {
      (document.getElementById(`${modalId}`) as HTMLDialogElement).showModal();
   };

   const closeModal = () => {
      (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
      // clear form data
      setFormData({
         client_name: '',
         event_name: '',
         event_date: '',
         event_type: '',
         event_title: '',
      });
   };

   return (
      <>
         <button className="btn bg-blue-600 text-slate-100 focus:bg-blue-700 hover:bg-blue-700" onClick={openModal}>
            <PlusCircleIcon />
            <span>{title}</span>
         </button>
         <ModalComponent
            modalId={modalId}
            modalHeader="Add new client"
            modalWrapper="p-0 w-11/12 max-w-xl"
            backgroundColorHeader="bg-blue-700 text-white px-6 py-5"
            modalBodyStyle="pt-3 px-6 pb-6"
            closeModal={closeModal}
         >
            <form onSubmit={(e) => handleSubmitClient(e)}>
               <div className="mb-1 md:flex-grow">
                  <FormIinput
                     label="Client Name"
                     inputName="client_name"
                     inputType="text"
                     placeholder="e.g. Mr. Convito"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     value={formData.client_name}
                     onChange={handleInputChange}
                     autoFocus={true}
                  />
               </div>
               <div className="mb-1 md:flex-grow">
                  <FormIinput
                     label="Event Title"
                     inputName="event_title"
                     inputType="text"
                     placeholder="e.g. The Wedding of"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     value={formData.event_title}
                     onChange={handleInputChange}
                     autoFocus={false}
                  />
               </div>
               <div className="mb-1 md:flex-grow">
                  <FormIinput
                     label="Event Name"
                     inputName="event_name"
                     inputType="text"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     placeholder="e.g. Mr. Convito & Ms. Convito"
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
                     value={formData.event_date}
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
                     disabled={statusClient === 'loading'}
                  >
                     Cancel
                  </button>
                  <button
                     className="btn bg-blue-700 text-white hover:bg-blue-800"
                     disabled={statusClient === 'loading'}
                  >
                     {statusClient === 'loading' ? (
                        <span className="loading loading-spinner loading-sm"></span>
                     ) : (
                        'Submit'
                     )}
                  </button>
               </div>
            </form>
         </ModalComponent>
      </>
   );
};
