"use client";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { DataTablesComponent } from "@/components/datatables";
import { PlusCircleIcon } from "@/components/icons/plusCircle";
import { ModalComponent } from "@/components/modal";
import { ModalAddCustomer } from "@/components/page/modalAddCustomer";

const breadcrumbsData = [
  {
    name: "dashboard",
    href: "/dashboard",
  },
  {
    name: "customers",
    href: "",
  },
];

type Customer = {
  id: string;
  name: string;
  email: string;
};

const customers = () => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };
};

const createCustomer = (numCustomer = 5) =>
  new Array(numCustomer).fill(undefined).map(customers);

const fakeCustomers = createCustomer(10);

const tableHead = ["No", "Name", "Email"];

const CustomerPage = () => {
  const [customers, setCustomers] = useState([] as Customer[]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([] as Customer[]);
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(5);

  useEffect(() => {
    setCustomers(fakeCustomers);
  }, []);

  // create filter all columns
  useEffect(() => {
    setFilteredCustomers(
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, customers]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.title = "Cenvito - Customers";
  }, []);
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Customers data</h1>
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="overflow-x-auto pt-3">
        <div className="flex items-center justify-between mb-3">
          <ModalAddCustomer modalId="add_customer" title="Add new customer" />
          <input
            type="text"
            className="border-[1px] border-slate-300 rounded-md px-3 py-2"
            placeholder="Search customer"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTablesComponent tableHead={tableHead}>
          {currentCustomers.map((customer, index) => (
            <tr key={index}>
              <td className="border-b-[1px] py-2 px-4 w-[3%]">{index + 1}</td>
              <td className="border-b-[1px] py-2 px-4 w-1/4">
                {customer.name}
              </td>
              <td className="border-b-[1px] py-2 px-4">{customer.email}</td>
            </tr>
          ))}
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
        </div>
      </div>
    </>
  );
};

export default CustomerPage;
