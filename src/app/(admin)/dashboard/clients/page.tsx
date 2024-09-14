'use client';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { useEffect, useState } from 'react';
import { DataTablesComponent } from '@/components/datatables';
import { ModalAddClient } from '@/components/page/modalAddClient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { deleteClient, fetchClients } from '@/app/GlobalRedux/Thunk/clients/clientThunk';
import moment from 'moment';
import { ModalEditClient } from '@/components/page/modalEditClient';
import Image from 'next/image';
import { EditIcon } from '@/components/icons/edit';
import { DeleteIcon } from '@/components/icons/delete';
import { DetailIcon } from '@/components/icons/detail';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/icons/calendar';
import { QrCode } from '@/components/icons/qrCode';
import Swal from 'sweetalert2';

interface Client {
   client_name: string;
}

const breadcrumbsData = [
   {
      name: 'dashboard',
      href: '/dashboard',
   },
   {
      name: 'clients',
      href: '',
   },
];

const tableHead = ['No', 'Name', 'Event Title', 'Event Name', 'Event Date', 'Event Type', 'Actions'];

const ClientPage = () => {
   const [search, setSearch] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [clientsPerPage, setClientsPerPage] = useState(10);
   const [idModalEdit, setIdModalEdit] = useState<number | null>(null);
   const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

   const clients = useSelector((state: RootState) => state.clients.clients);
   const status = useSelector((state: RootState) => state.clients.status);

   const dispatch = useDispatch<AppDispatch>();
   const router = useRouter();

   useEffect(() => {
      dispatch(fetchClients());
   }, [dispatch]);

   // pagination
   const indexOfLastClient = currentPage * clientsPerPage;
   const indexOfFirstClient = indexOfLastClient - clientsPerPage;
   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   useEffect(() => {
      document.title = 'Convito - Clients';
   }, []);

   const handleOpenModalEdit = (clientId: number) => {
      setIdModalEdit(clientId);
      setIsOpenModalEdit(true);
   };

   const closeEditModal = () => {
      setIsOpenModalEdit(false);
      const modal = document.getElementById('edit_client') as HTMLDialogElement;
      modal.close();
   };

   const handleDeleteClient = (clientId: string) => {
      Swal.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
         if (result.isConfirmed) {
            dispatch(deleteClient(clientId))
               .unwrap()
               .then((res) => {
                  if (res.status === 201) {
                     Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success',
                     }).then(() => {
                        dispatch(fetchClients());
                     });
                  } else {
                     Swal.fire({
                        title: 'Failed!',
                        text: 'Failed to delete client',
                        icon: 'warning',
                     });
                  }
               });
         }
      });
   };

   useEffect(() => {
      if (isOpenModalEdit) {
         const modal = document.getElementById('edit_client') as HTMLDialogElement;

         if (modal) {
            modal.showModal();
         }
      }
   }, [isOpenModalEdit]);

   return (
      <>
         <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Clients data</h1>
            <BreadcrumbsComponent data={breadcrumbsData} />
         </div>
         <div className="overflow-x-auto pt-3">
            <div className="flex items-center justify-between mb-3">
               <ModalAddClient modalId="add_client" title="Add client" />
               <input
                  type="text"
                  className="border-[1px] border-slate-300 rounded-md px-3 py-2"
                  placeholder="Search client"
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <DataTablesComponent tableHead={tableHead}>
               {status === 'loading' || status === 'idle' ? (
                  <tr>
                     <td colSpan={9} className="text-center py-4">
                        <span className="loading loading-spinner loading-lg"></span>
                     </td>
                  </tr>
               ) : (
                  <>
                     {Array.isArray(clients) && clients.length > 0 ? (
                        clients
                           .filter((client: Client) => {
                              if (search === '') {
                                 return client;
                              }
                              return client.client_name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
                           })
                           .slice(indexOfFirstClient, indexOfLastClient)
                           .map((client, index) => (
                              <tr key={index}>
                                 <td className="border-b-[1px] py-2 px-4 w-[3%]">{index + 1}</td>
                                 <td className="border-b-[1px] py-2 px-4 ">{client?.client_name}</td>
                                 <td className="border-b-[1px] py-2 px-4 ">{client?.event_title ?? ' - '}</td>
                                 <td className="border-b-[1px] py-2 px-4 ">{client?.event_name}</td>
                                 <td className="border-b-[1px] py-2 px-4 ">
                                    {moment(client?.event_date).format('DD MMMM YYYY')}
                                 </td>
                                 <td className="border-b-[1px] py-2 px-4 ">{client?.event_type}</td>
                                 <td className="border-b-[1px] py-2 px-4 flex items-center gap-2">
                                    <button
                                       className="btn bg-info tooltip tooltip-bottom"
                                       data-tip="RSVP"
                                       onClick={() => {
                                          router.push(`/dashboard/clients/${client?.client_id}`);
                                       }}
                                    >
                                       <Calendar className="size-4" />
                                    </button>
                                    <button
                                       className="btn bg-neutral text-white tooltip tooltip-bottom"
                                       data-tip="QR Code"
                                       onClick={() => {
                                          router.push(`/dashboard/clients/qr/${client?.client_id}`);
                                       }}
                                    >
                                       <QrCode className="size-4" />
                                    </button>
                                    <button
                                       className="btn bg-yellow-400 text-slate-900 tooltip tooltip-bottom"
                                       data-tip="Edit"
                                       onClick={() => handleOpenModalEdit(client?.client_id)}
                                    >
                                       <EditIcon className="size-4" />
                                    </button>
                                    <button
                                       className="btn bg-red-500 text-slate-100 tooltip tooltip-bottom"
                                       data-tip="Delete"
                                       onClick={() => handleDeleteClient(client?.id)}
                                    >
                                       <DeleteIcon className="size-4" />
                                    </button>
                                 </td>
                              </tr>
                           ))
                     ) : (
                        <tr>
                           <td colSpan={9} className="text-center py-4">
                              No data found
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
                     {clients ? (
                        <>
                           {currentPage} of {Math.ceil(clients?.length / clientsPerPage)}
                        </>
                     ) : (
                        '0 of 0'
                     )}
                  </button>
                  <button
                     className="join-item btn"
                     onClick={() => paginate(currentPage + 1)}
                     disabled={clients ? currentPage === Math.ceil(clients?.length / clientsPerPage) : true}
                  >
                     »
                  </button>
               </div>
            </div>
         </div>
         {isOpenModalEdit && (
            <ModalEditClient modalId="edit_client" clientId={idModalEdit} closeModal={closeEditModal} />
         )}
      </>
   );
};

export default ClientPage;
