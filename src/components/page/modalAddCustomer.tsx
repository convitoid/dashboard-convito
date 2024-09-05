'use client';

import { FormIinput } from '../formInput';
import { PlusCircleIcon } from '../icons/plusCircle';
import { ModalComponent } from '../modal';

type ModalAddCustomerProps = {
   modalId?: string;
   title?: string;
};

export const ModalAddCustomer = ({ modalId, title }: ModalAddCustomerProps) => {
   const handleSubmitCustomer = (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
   };

   const openModal = () => {
      (document.getElementById(`${modalId}`) as HTMLDialogElement).showModal();
   };

   const closeModal = () => {
      (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
   };

   return (
      <>
         <button className="btn bg-blue-600 text-slate-100 focus:bg-blue-700 hover:bg-blue-700" onClick={openModal}>
            <PlusCircleIcon />
            <span>{title}</span>
         </button>
         <ModalComponent
            modalId={modalId}
            modalHeader="Add new customer"
            modalWrapper="p-0"
            backgroundColorHeader="bg-blue-700 text-white px-6 py-5"
            modalBodyStyle="pt-3 px-6 pb-6"
            closeModal={closeModal}
         >
            <form onSubmit={(e) => handleSubmitCustomer(e)}>
               <FormIinput
                  label="Client Name"
                  inputName="client_name"
                  inputType="text"
                  placeholder="Input client name here"
                  labelStyle="text-slate-900 font-semibold text-sm"
                  inputStyle="input input-bordered h-10"
                  autoFocus={true}
               />
               <div className="mb-1">
                  <FormIinput
                     label="Event Date"
                     inputName="event_date"
                     inputType="date"
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     autoFocus={false}
                  />
               </div>
               <div className="mb-1">
                  <FormIinput
                     label="Location Type"
                     inputName="location_type"
                     inputType="text"
                     placeholder="Example: Hotel, Restaurant, etc."
                     labelStyle="text-slate-900 font-semibold text-sm"
                     inputStyle="input input-bordered h-10"
                     autoFocus={false}
                  />
               </div>
               <div className="mb-1">
                  <label className="form-control">
                     <div className="label">
                        <span className="label-text text-slate-900 font-semibold text-sm">Location Address</span>
                     </div>
                     <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Bio"
                        name="location_address"
                     ></textarea>
                  </label>
               </div>
               <div className="flex items-center justify-end gap-1 mt-4">
                  <button className="btn bg-slate-300" type="button" onClick={closeModal}>
                     Cancel
                  </button>
                  <button className="btn bg-blue-700 text-white hover:bg-blue-800">Submit</button>
               </div>
            </form>
         </ModalComponent>
      </>
   );
};
