'use client';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { useEffect, useState } from 'react';
import { DataTablesComponent } from '@/components/datatables';
import { ModalAddUser } from '@/components/page/modalAddUser';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { deleteUser, fetchUsers, findUserById } from '@/app/GlobalRedux/Features/user/userSlicer';
import { ModalEditUser } from '@/components/page/modalEditUser';
import Swal from 'sweetalert2';
import { EditIcon } from '@/components/icons/edit';
import { DeleteIcon } from '@/components/icons/delete';

const breadcrumbsData = [
   {
      name: 'dashboard',
      href: '/dashboard',
   },
   {
      name: 'user settings',
      href: '',
   },
   {
      name: 'users',
      href: '',
   },
];

const tableHead = ['No', 'Username', 'Email', 'Created At', 'Updated At', 'Created By', 'Updated By', 'Actions'];

interface User {
   username: string;
   email: string;
}
type ModalUserProps = {
   modalId?: string;
   userId?: number;
};

const UsersPage = () => {
   const [search, setSearch] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [usersPerPage, setUsersPerPage] = useState(10);
   const [idUser, setIdUser] = useState<number | null>(null);
   const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

   const dispatch = useDispatch<AppDispatch>();
   const users = useSelector((state: RootState) => state?.users?.users);
   const status = useSelector((state: RootState) => state.users.status);
   const error = useSelector((state: RootState) => state.users.error);

   useEffect(() => {
      dispatch(fetchUsers());
   }, [dispatch]);

   const indexOfLastUser = currentPage * usersPerPage;
   const indexOfFirstUsers = indexOfLastUser - usersPerPage;

   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   const openEditModal = (id: number) => {
      setIdUser(id);
      setIsOpenModalEdit(true);
   };

   const closeEditModal = () => {
      setIsOpenModalEdit(false);
      const modal = document.getElementById('edit_user') as HTMLDialogElement;
      modal.close();
   };

   const deleteHandler = (id: number, username: string) => {
      Swal.fire({
         title: 'Are you sure?',
         html: `Are you sure want to delete user <b>${username}</b> ?`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            try {
               dispatch(deleteUser(id))
                  .unwrap()
                  .then((res) => {
                     if (res.status === 201) {
                        Swal.fire({
                           title: 'Deleted!',
                           text: 'User has been deleted.',
                           icon: 'success',
                        });
                        dispatch(fetchUsers());
                     }

                     if (res.status === 400) {
                        Swal.fire({
                           title: 'Failed!',
                           text: res.message,
                           icon: 'error',
                        });
                     }
                  });
            } catch (error) {
               Swal.fire({
                  title: 'Failed!',
                  text: 'Failed to delete user.',
                  icon: 'error',
               });
            }
         }
      });
   };

   useEffect(() => {
      if (isOpenModalEdit) {
         const modal = document.getElementById('edit_user') as HTMLDialogElement;
         if (modal) {
            modal.showModal();
         }
      }
   }, [isOpenModalEdit]);

   useEffect(() => {
      document.title = 'Convito - Users Data';
   }, []);

   return (
      <>
         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <h1 className="text-2xl font-bold">Users Data</h1>
            <BreadcrumbsComponent data={breadcrumbsData} />
         </div>
         <div className="overflow-x-auto pt-3">
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 md:items-center md:justify-between mb-3">
               <ModalAddUser modalId="add_user" title="Add New User" />
               <input
                  type="text"
                  className="border-[1px] border-slate-300 rounded-md px-3 py-2"
                  placeholder="Search user"
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <DataTablesComponent tableHead={tableHead}>
               {status === 'loading' || status === 'idle' ? (
                  <tr>
                     <td colSpan={8} className="text-center py-4">
                        <span className="loading loading-spinner loading-lg"></span>
                     </td>
                  </tr>
               ) : (
                  <>
                     {Array.isArray(users) && users.length > 0 ? (
                        users
                           .filter((user: User) => {
                              if (search === '') {
                                 return user;
                              }
                              return user.username.toLowerCase().includes(search.toLowerCase());
                           })
                           .slice(indexOfFirstUsers, indexOfLastUser)
                           .map((user, index) => (
                              <tr key={index}>
                                 <td className="border-b-[1px] py-2 px-4 w-[3%]">
                                    {index + 1 + (currentPage - 1) * usersPerPage}
                                 </td>
                                 <td className="border-b-[1px] py-2 px-4 w-1/4">{user.username}</td>
                                 <td className="border-b-[1px] py-2 px-4">{user.email}</td>
                                 <td className="border-b-[1px] py-2 px-4">{moment(user.createdAt).format('D-M-Y')}</td>
                                 <td className="border-b-[1px] py-2 px-4">{moment(user.updatedAt).format('D-M-Y')}</td>
                                 <td className="border-b-[1px] py-2 px-4">{user.createdBy}</td>
                                 <td className="border-b-[1px] py-2 px-4">{user.updatedBy}</td>
                                 <td className="border-b-[1px] py-2 px-4 flex items-center gap-2">
                                    <div className="tooltip tooltip-bottom" data-tip="Edit">
                                       <button
                                          className="btn bg-yellow-400 text-slate-900"
                                          onClick={() => {
                                             openEditModal(user.id);
                                          }}
                                       >
                                          <EditIcon />
                                       </button>
                                    </div>
                                    <div className="tooltip tooltip-bottom" data-tip="Delete">
                                       <button
                                          className="btn bg-red-500 text-white"
                                          onClick={() => deleteHandler(user.id, user.username)}
                                       >
                                          <DeleteIcon />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                     ) : (
                        <tr>
                           <td colSpan={8} className="text-center py-4">
                              No data
                           </td>
                        </tr>
                     )}
                  </>
               )}
            </DataTablesComponent>
            <div className="flex justify-end mt-4">
               <div className="join">
                  <button
                     className="join-item btn"
                     onClick={() => paginate(currentPage - 1)}
                     disabled={currentPage === 1}
                  >
                     «
                  </button>
                  <button className="join-item btn">
                     {currentPage} of {Math.ceil((Array.isArray(users) && users.length / usersPerPage) || 0)}
                  </button>
                  <button
                     className="join-item btn"
                     onClick={() => paginate(currentPage + 1)}
                     disabled={
                        currentPage === Math.ceil((Array.isArray(users) && users.length / usersPerPage) || 0) ||
                        (Array.isArray(users) && users.length < usersPerPage)
                     }
                  >
                     »
                  </button>
               </div>
            </div>
         </div>
         {isOpenModalEdit && <ModalEditUser modalId="edit_user" userId={idUser ?? 0} closeModal={closeEditModal} />}
      </>
   );
};

export default UsersPage;
