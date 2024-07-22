"use client";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { useEffect, useState } from "react";
import { faker, tr } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { DataTablesComponent } from "@/components/datatables";
import { ModalAddUser } from "@/components/page/modalAddUser";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchUsers } from "@/app/GlobalRedux/Features/user/userSlicer";

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

const tableHead = [
  "No",
  "Username",
  "Email",
  "Created At",
  "Updated At",
  "Created By",
  "Updated By",
  "Actions",
];

interface User {
  username: string;
  email: string;
}

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state?.users?.users);
  const status = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  console.log(users);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUsers = indexOfLastUser - usersPerPage;

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
          {status === "loading" || status === "idle" ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <span className="loading loading-spinner loading-lg"></span>
              </td>
            </tr>
          ) : (
            <>
              {/* tambahkan filter juga */}
              {Array.isArray(users) && users.length > 0 ? (
                users
                  .filter((user: User) => {
                    if (search === "") {
                      return user;
                    } else if (
                      user.username.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return user;
                    }
                  })
                  .slice(indexOfFirstUsers, indexOfLastUser)
                  .map((user, index) => (
                    <tr key={index}>
                      <td className="border-b-[1px] py-2 px-4 w-[3%]">
                        {index + 1}
                      </td>
                      <td className="border-b-[1px] py-2 px-4 w-1/4">
                        {user.username}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">{user.email}</td>
                      <td className="border-b-[1px] py-2 px-4">
                        {moment(user.createdAt).format("D-M-Y")}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {moment(user.updatedAt).format("D-M-Y")}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {user.createdBy}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {user.updatedBy}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        <button className="btn bg-slate-900 text-white">
                          Edit
                        </button>
                        <button className="btn bg-red-500 text-white">
                          Delete
                        </button>
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
              {currentPage} of {Math.ceil(users.length / usersPerPage)}
            </button>
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(users.length / usersPerPage) ||
                users.length === 0
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
