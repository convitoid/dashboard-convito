"use client";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { useEffect, useState } from "react";
import { faker, tr } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { DataTablesComponent } from "@/components/datatables";
import { PlusCircleIcon } from "@/components/icons/plusCircle";
import { ModalComponent } from "@/components/modal";
import { ModalAddCustomer } from "@/components/page/modalAddCustomer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchClients } from "@/app/GlobalRedux/Features/clients/clientSlice";
import moment from "moment";

interface Client {
  client_name: string;
}

const breadcrumbsData = [
  {
    name: "dashboard",
    href: "/dashboard",
  },
  {
    name: "clients",
    href: "",
  },
];

const tableHead = [
  "No",
  "ID",
  "Name",
  "Event Date",
  "Location Type",
  "Event Location",
  "Created At",
  "Created By",
  "Actions",
];

const ClientPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(5);

  const clients = useSelector((state: RootState) => state.clients.clients);
  const status = useSelector((state: RootState) => state.clients.status);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  console.log("clients data", clients);

  // pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.title = "Convito - Clients";
  }, []);
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Clients data</h1>
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="overflow-x-auto pt-3">
        <div className="flex items-center justify-between mb-3">
          <ModalAddCustomer modalId="add_customer" title="Add client" />
          <input
            type="text"
            className="border-[1px] border-slate-300 rounded-md px-3 py-2"
            placeholder="Search client"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTablesComponent tableHead={tableHead}>
          {status === "loading" || status === "idle" ? (
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
                    if (search === "") {
                      return client;
                    }
                    return client.client_name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase());
                  })
                  .slice(indexOfFirstCustomer, indexOfLastCustomer)
                  .map((client, index) => (
                    <tr key={index}>
                      <td className="border-b-[1px] py-2 px-4 w-[3%]">
                        {index + 1}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {client?.client_id}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {client?.client_name}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {moment(client?.event_date).format(
                          "dddd, DD MMMM YYYY"
                        )}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {client?.location_type}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {client?.event_location}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {moment(client?.created_at).format("DD-MM-YYYY")}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 ">
                        {client?.createdBy}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 flex items-center gap-2">
                        <button className="btn bg-yellow-400 text-slate-900">
                          Edit
                        </button>
                        <button className="btn bg-red-500 text-slate-100">
                          Delete
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
        {/* <div className="flex justify-end mt-4">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn">
              {currentPage} of{" "}
              {Math.ceil(filteredCustomers.length / customersPerPage)}
            </button>
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredCustomers.length / customersPerPage)
              }
            >
              »
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ClientPage;
