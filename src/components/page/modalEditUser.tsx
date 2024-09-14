import { useEffect, useState } from 'react';
import { FormIinput } from '../formInput'; // Perbaiki nama komponen dari FormIinput ke FormInput
import { ModalComponent } from '../modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchUsers, findUserById, updateUser } from '@/app/GlobalRedux/Features/user/userSlicer';
import Swal from 'sweetalert2';

type ModalUserProps = {
   modalId?: string;
   userId?: number | null; // Sesuaikan tipe userId agar dapat menerima null
   closeModal: () => void;
};

export const ModalEditUser = ({ modalId, userId, closeModal }: ModalUserProps) => {
   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.users.userStatus);
   const user = useSelector((state: RootState) => state.users.user) as {
      username?: string;
      email?: string;
   };

   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
   });

   useEffect(() => {
      if (userId !== null && userId !== undefined) {
         dispatch(findUserById(userId));
      }
   }, [dispatch, userId]);

   useEffect(() => {
      if (status === 'success' && user) {
         setFormData({
            username: user.username ?? '',
            email: user.email ?? '',
            password: '',
         });
      }
   }, [status, user]);

   const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let newData = {
         ...formData,
         id: userId,
      };

      try {
         dispatch(updateUser(newData))
            .unwrap()
            .then((res) => {
               if (res.status === 201) {
                  Swal.fire({
                     title: 'Success',
                     text: 'User updated successfully',
                     icon: 'success',
                  });

                  closeModal();
                  setFormData({ username: '', email: '', password: '' });
                  dispatch(fetchUsers());
               }

               if (res.status === 400) {
                  Swal.fire({
                     title: 'Error',
                     text: res.message,
                     icon: 'error',
                     target: document.getElementById(`${modalId ?? ''}`),
                  });
                  dispatch(fetchUsers());
               }
            });
      } catch (error) {
         Swal.fire({
            title: 'Error',
            text: 'Failed to update user',
            icon: 'error',
         });
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const closeModalEdit = () => {
      closeModal();
      setFormData({ username: '', email: '', password: '' });
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Edit user"
         modalWrapper="p-0"
         backgroundColorHeader="bg-yellow-400 text-slate-900 px-6 py-5"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModalEdit}
      >
         <form onSubmit={submitHandler}>
            {status === 'loading' || status === 'idle' ? (
               <>
                  <div className="flex w-full flex-col gap-2 px-1 mb-3">
                     <span className="text-sm font-semibold">Username</span>
                     <div className="skeleton h-8 w-full p-5"></div>
                  </div>
                  <div className="flex w-full flex-col gap-2 px-1 mb-3">
                     <span className="text-sm font-semibold">Email</span>
                     <div className="skeleton h-8 w-full p-5"></div>
                  </div>
                  <div className="flex w-full flex-col gap-2 px-1 mb-3">
                     <span className="text-sm font-semibold">Password</span>
                     <div className="skeleton h-8 w-full p-5"></div>
                  </div>
               </>
            ) : (
               <>
                  <div className="mb-1">
                     <FormIinput
                        label="Username"
                        inputName="username"
                        inputType="text"
                        placeholder="Input username here"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.username}
                        onChange={handleInputChange}
                        autoFocus={true}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Email"
                        inputName="email"
                        inputType="email"
                        placeholder="example@mail.com"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoFocus={false}
                     />
                  </div>
                  <div className="mb-1">
                     <FormIinput
                        label="Password"
                        inputName="password"
                        inputType="password"
                        placeholder="••••••••"
                        labelStyle="text-slate-900 font-semibold text-sm"
                        inputStyle="input input-bordered h-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoFocus={false}
                     />
                  </div>
               </>
            )}
            <div className="flex items-center justify-end gap-1 mt-4">
               <button className="btn" type="button" onClick={closeModalEdit}>
                  Cancel
               </button>
               <button className="btn bg-yellow-400 text-slate-900 hover:bg-yellow-500" type="submit">
                  Submit
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
