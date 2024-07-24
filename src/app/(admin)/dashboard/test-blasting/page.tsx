"use client";
import { sendMessage } from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import { AppDispatch, RootState } from "@/app/store";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { Card } from "@/components/card";
import { SendIcon } from "@/components/icons/send";
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

const DummyBlastingPage = () => {
  const [formData, setFormData] = useState({
    access_token: process.env.NEXT_WHATSAPP_TOKEN_ID ?? "",
    test_phone_number: "5556112319",
    target_phone_number: "",
    event_name: "",
    sender: "",
    invitation_link: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.testBlasting.data);
  const status = useSelector((state: RootState) => state.testBlasting.status);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendBlasting = (e: any) => {
    e.preventDefault();
    dispatch(sendMessage(formData))
      .unwrap()
      .then((res) => {
        let errorMessage;
        console.log("response", res);

        if (!res.error) {
          Swal.fire({
            title: "Success",
            text: "Blasting message sent successfully",
            icon: "success",
          });
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
    document.title = "Cenvito - Test Blasting";
  }, []);
  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="grid grid-cols-1 3md:grid-cols-2">
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
            <h2 className="text-lg font-semibold mb-4">
              Test blasting whatsapp
            </h2>
            <div className="grid gap-4 3md:grid-cols-2 3md:gap-5 mb-5">
              <div className="col-span-1">
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
              <div className="col-span-1">
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
            </div>
            <div className="grid gap-4 3md:grid-cols-2 3md:gap-5 ">
              <div className="col-span-1">
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
              <div className="col-span-1">
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
            </div>
            <div className="mb-5">
              <label
                htmlFor="invitation_link"
                className="text-[.9rem] font-semibold"
              >
                Invitation Link
              </label>
              <input
                type="text"
                placeholder="e.g. https://yourwebsite.com/invitation"
                className="input input-bordered w-full mt-2"
                name="invitation_link"
                value={formData.invitation_link}
                onChange={handleInputChange}
              />
            </div>
            <button
              className={`btn btn-accent ${
                status === "loading" ? "btn-disabled" : ""
              }`}
            >
              <SendIcon />
              <span>
                {status === "loading" ? "Sending..." : "Send Blasting"}
              </span>
            </button>
          </Card>
        </form>
      </div>
    </>
  );
};

export default DummyBlastingPage;
