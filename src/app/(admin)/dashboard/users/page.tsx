"use client";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { DataTablesComponent } from "@/components/datatables";
import { ModalAddUser } from "@/components/page/modalAddUser";

const breadcrumbsData = [
  {
    name: "dashboard",
    href: "/dashboard",
  },
  {
    name: "setting",
    href: "",
  },
  {
    name: "users",
    href: "",
  },
];

type User = {
  id: string;
  name: string;
  email: string;
};

const users = () => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };
};

const createUser = (numUser = 5) =>
  new Array(numUser).fill(undefined).map(users);

const fakeUser = createUser(10);

const tableHead = ["No", "Name", "Email"];

const UsersPage = () => {
  const [users, setUsers] = useState([] as User[]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([] as User[]);
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  useEffect(() => {
    setUsers(fakeUser);
  }, []);

  // create filter all columns
  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUsers = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUsers, indexOfLastUser);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.title = "Cenvito - Users Data";
  }, []);
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Users data</h1>
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="overflow-x-auto pt-3">
        <div className="flex items-center justify-between mb-3">
          <ModalAddUser modalId="add_user" title="Add new user" />
          <input
            type="text"
            className="border-[1px] border-slate-300 rounded-md px-3 py-2"
            placeholder="Search user"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTablesComponent tableHead={tableHead}>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td className="border-b-[1px] py-2 px-4 w-[3%]">{index + 1}</td>
              <td className="border-b-[1px] py-2 px-4 w-1/4">{user.name}</td>
              <td className="border-b-[1px] py-2 px-4">{user.email}</td>
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
              {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
            </button>
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredUsers.length / usersPerPage)
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

export default UsersPage;
