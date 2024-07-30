"use client";
import {
  fetchLogs,
  sendMessage,
} from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import { AppDispatch, RootState } from "@/app/store";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { Card } from "@/components/card";
import { DataTablesComponent } from "@/components/datatables";
import { DetailIcon } from "@/components/icons/detail";
import { SendIcon } from "@/components/icons/send";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const breadcrumbsData = [
  {
    name: "dahsboard",
    href: "/dashboard",
  },
  {
    name: "test blasting",
    href: "",
  },
];

const tableHead = [
  "No",
  "Client ID",
  "Phone Number",
  "Event Name",
  "Sender",
  "Created At",
  "Actions",
];

const DummyBlastingPage = () => {
  const [formData, setFormData] = useState({
    access_token: process.env.NEXT_WHATSAPP_TOKEN_ID ?? "",
    test_phone_number: "5556112319",
    target_phone_number: "",
    event_name: "",
    sender: "",
    invitation_link: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [logPerPage, setlogPerPage] = useState(10);

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.testBlasting.data);
  const logs = useSelector((state: RootState) => state.testBlasting.logs);
  const status = useSelector((state: RootState) => state.testBlasting.status);
  const statusLogs = useSelector(
    (state: RootState) => state.testBlasting.statusLogs
  );

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendBlasting = (e: any) => {
    e.preventDefault();
    dispatch(sendMessage(formData))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (!res.error) {
          Swal.fire({
            title: "Success",
            text: "Blasting message sent successfully",
            icon: "success",
          });
          dispatch(fetchLogs());
        } else {
          Swal.fire({
            title: "Error",
            text:
              res.error.code === 100 || res.error.code === 190
                ? "Invalid token please visit https://developers.facebook.com to get a new token"
                : res?.error?.error_data?.details,
            icon: "error",
          });
        }
      });
  };

  useEffect(() => {
    document.title = "Convito - Test Blasting";
  }, []);

  const indexOfLastLogs = currentPage * logPerPage;
  const indexOfFirstLogs = indexOfLastLogs - logPerPage;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <form onSubmit={(e) => handleSendBlasting(e)}>
        <Card cardWrapper="bg-slate-50 text-slate-900 shadow-md mb-5">
          <h2 className="text-[1rem] font-semibold mb-1">
            Temporary access token
          </h2>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Input your token here"
              className="input input-bordered w-full"
              name="access_token"
              value={formData.access_token}
              onChange={handleInputChange}
            />
            <span className="mt-2 px-1 text-[.8rem]">
              This token will be valid for 24 hours. To obtain a temporary
              token, please log in with your Meta Developer account{" "}
              <span className="text-blue-800 font-semibold">
                <a href="https://developers.facebook.com" target="_blank">
                  here
                </a>
              </span>
            </span>
          </div>
        </Card>
        <Card cardWrapper="bg-slate-50 text-slate-900 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Test blasting whatsapp</h2>
          <div className="flex">
            <div className="grid grid-cols-1 md:grid-cols-2 2md:grid-cols-3 3md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="mb-1">
                <label
                  htmlFor="test_phone_number"
                  className="text-[.9rem] font-semibold"
                >
                  From
                </label>
                <input
                  type="text"
                  placeholder="+1 555 611 2319"
                  className="input input-bordered w-full mt-2"
                  name="test_phone_number"
                  value={formData.test_phone_number}
                  readOnly={true}
                />
              </div>
              <div className="mb-1">
                <label
                  htmlFor="target_phone_number"
                  className="text-[.9rem] font-semibold"
                >
                  To
                </label>
                <input
                  type="number"
                  placeholder="e.g. 628123456789"
                  className="input input-bordered w-full mt-2"
                  name="target_phone_number"
                  value={formData.target_phone_number}
                  onChange={handleInputChange}
                  autoFocus={true}
                />
              </div>
              <div className="mb-1">
                <label
                  htmlFor="event_name"
                  className="text-[.9rem] font-semibold"
                >
                  Event name
                </label>
                <input
                  type="text"
                  placeholder="e.g weeding invitation Jhon & Jane"
                  className="input input-bordered w-full mt-2"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-1">
                <label htmlFor="sender" className="text-[.9rem] font-semibold">
                  Sender
                </label>
                <input
                  type="text"
                  placeholder="e.g. by Event Organizer Team"
                  className="input input-bordered w-full mt-2"
                  name="sender"
                  value={formData.sender}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="invitation_link"
                  className="text-[.9rem] font-semibold"
                >
                  Invitation Link
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="e.g. "
                    className="input input-bordered w-full mt-2"
                    name="invitation_link"
                    value={formData.invitation_link}
                    onChange={handleInputChange}
                  />
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Send Message"
                  >
                    <button
                      className={`btn btn-primary mt-2${
                        status === "loading" ? "btn-disabled" : ""
                      }`}
                    >
                      {status === "loading" ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        <>
                          <SendIcon />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </form>
      <Card cardWrapper="bg-slate-50 shadow-md mt-5 overflow-x-auto">
        <h1 className="font-semibold text-lg mb-4 uppercase">
          Logs test blasting message
        </h1>
        <DataTablesComponent tableHead={tableHead}>
          {statusLogs === "loading" || statusLogs === "idle" ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                <span className="loading loading-spinner loading-lg"></span>
              </td>
            </tr>
          ) : (
            <>
              {Array.isArray(logs) && logs.length > 0 ? (
                logs
                  .slice(indexOfFirstLogs, indexOfLastLogs)
                  .map((log, index) => (
                    <tr key={log.id}>
                      <td className="border-b-[1px] py-2 px-4 w-[3%]">
                        {index + 1 + (currentPage - 1) * logPerPage}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {log.clientId}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {log.phoneNumber}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {log.eventName}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {log.senderName}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        {moment(log.createdAt).format("D MMM Y")}
                      </td>
                      <td className="border-b-[1px] py-2 px-4">
                        <div
                          className="tooltip tooltip-bottom"
                          data-tip="Details"
                        >
                          <Link
                            href={`/dashboard/test-blasting/${log.clientId}`}
                            className="btn btn-info"
                          >
                            <DetailIcon />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No data
                  </td>
                </tr>
              )}
            </>
          )}
        </DataTablesComponent>
        <div className="flex justify-start md:justify-end mt-6">
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
              {Math.ceil(
                (Array.isArray(logs) && logs.length / logPerPage) || 0
              )}
            </button>
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                  Math.ceil(
                    (Array.isArray(logs) && logs.length / logPerPage) || 0
                  ) ||
                (Array.isArray(logs) && logs.length < logPerPage)
              }
            >
              »
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DummyBlastingPage;
