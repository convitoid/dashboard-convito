'use client';

import React, { useState, useEffect } from 'react';
import { FormIinput } from '../formInput';
import { PlusCircleIcon } from '../icons/plusCircle';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { fetchGuests } from '@/app/GlobalRedux/Thunk/guests/guestThunk';
import axios from 'axios';

type ModalAddGuestProps = {
   modalId?: string;
   title?: string;
   clientId: string;
};

export const ModalAddGuest = ({ modalId, title, clientId }: ModalAddGuestProps) => {
   const [formData, setFormData] = useState({
      name: '',
      phone_number: '',
      pax: '',
      kids_pax: '',
      holmat_pax: '',
      welcome_dinner_pax: '',
      hotel: '',
      scenario: '',
   });
   const [scenarios, setScenarios] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const { data: session } = useSession();
   const dispatch = useDispatch<AppDispatch>();

   // Fetch scenarios when modal opens
   useEffect(() => {
      const fetchScenarios = async () => {
         try {
            const getToken = await fetch('/api/auth/session')
               .then((res) => res.json())
               .then((data) => data);
               
            const response = await axios.get(`/api/scenario/${clientId}`, {
               headers: {
                  Authorization: `Bearer ${getToken.user.jwt}`,
               },
            });
            console.log('Scenarios response:', response.data);
            if (response.data.status === 200) {
               setScenarios(response.data.data);
               console.log('Scenarios set:', response.data.data);
            }
         } catch (error) {
            console.error('Error fetching scenarios:', error);
         }
      };
      
      if (clientId && session) {
         fetchScenarios();
      }
   }, [clientId, session]);

   const handleSubmitGuest = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!formData.name.trim()) {
         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: 'Name is required',
            target: document.getElementById(`${modalId}`),
         });
      }

      if (!formData.scenario.trim()) {
         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: 'Scenario is required',
            target: document.getElementById(`${modalId}`),
         });
      }

      if (!formData.phone_number.trim()) {
         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: 'Phone Number is required',
            target: document.getElementById(`${modalId}`),
         });
      }

      if (!formData.pax.trim()) {
         return Swal.fire({
            icon: 'info',
            title: 'Validation error',
            text: 'PAX is required',
            target: document.getElementById(`${modalId}`),
         });
      }

      setIsLoading(true);

      try {
         const response = await axios.post('/api/guests/add', {
            clientId,
            guestData: formData,
         });

         if (response.data.status === 201) {
            Swal.fire({
               icon: 'success',
               title: 'Success',
               text: 'Guest added successfully',
               target: document.getElementById(`${modalId}`),
            }).then(() => {
               dispatch(fetchGuests(clientId));
               closeModal();
            });
         }
      } catch (error) {
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add guest',
            target: document.getElementById(`${modalId}`),
         });
      } finally {
         setIsLoading(false);
      }
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
      setFormData({
         name: '',
         phone_number: '',
         pax: '',
         kids_pax: '',
         holmat_pax: '',
         welcome_dinner_pax: '',
         hotel: '',
         scenario: '',
      });
   };

   return (
      <>
         <button className="btn bg-green-600 text-slate-100 focus:bg-green-700 hover:bg-green-700" onClick={openModal}>
            <PlusCircleIcon />
            <span>{title}</span>
         </button>
         <ModalComponent
            modalId={modalId}
            modalHeader="Add New Guest"
            modalWrapper="p-0 w-11/12 max-w-2xl"
            backgroundColorHeader="bg-green-700 text-white px-6 py-5"
            modalBodyStyle="pt-3 px-6 pb-6"
            closeModal={closeModal}
         >
            <form onSubmit={handleSubmitGuest}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-1">
                     <FormIinput
                        label="Name *"
                        inputName="name"
                        inputType="text"
                        placeholder="e.g. John Doe"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoFocus={true}
                     />
                  </div>
                  <div className="mb-1">
                     <label className="text-slate-900 font-semibold text-sm block mb-1">Scenario *</label>
                     <select
                        name="scenario"
                        className="select select-bordered h-10 w-full"
                        value={formData.scenario}
                        onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                     >
                        <option value="">Select Scenario</option>
                        {scenarios.map((scenario: any) => (
                           <option key={scenario.id} value={scenario.scenario_name}>
                              {scenario.scenario_name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Phone Number *"
                        inputName="phone_number"
                        inputType="text"
                        placeholder="e.g. 628123456789"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="PAX *"
                        inputName="pax"
                        inputType="number"
                        placeholder="e.g. 2"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.pax}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Kids PAX"
                        inputName="kids_pax"
                        inputType="number"
                        placeholder="e.g. 1"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.kids_pax}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Holmat PAX"
                        inputName="holmat_pax"
                        inputType="number"
                        placeholder="e.g. 2"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.holmat_pax}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Welcome Dinner PAX"
                        inputName="welcome_dinner_pax"
                        inputType="number"
                        placeholder="e.g. 2"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.welcome_dinner_pax}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Hotel"
                        inputName="hotel"
                        inputType="text"
                        placeholder="e.g. Hotel Name"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.hotel}
                        onChange={handleInputChange}
                     />
                  </div>

               </div>
               <div className="flex items-center justify-end gap-1 mt-4">
                  <button
                     className="btn bg-slate-300"
                     type="button"
                     onClick={closeModal}
                     disabled={isLoading}
                  >
                     Cancel
                  </button>
                  <button
                     className="btn bg-green-700 text-white hover:bg-green-800"
                     disabled={isLoading}
                  >
                     {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                     ) : (
                        'Add Guest'
                     )}
                  </button>
               </div>
            </form>
         </ModalComponent>
      </>
   );
};