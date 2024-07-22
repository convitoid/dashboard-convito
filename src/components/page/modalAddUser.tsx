"use client";

import Swal from "sweetalert2";
import { FormIinput } from "../formInput";
import { PlusCircleIcon } from "../icons/plusCircle";
import { ModalComponent } from "../modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import {
  createUser,
  fetchUsers,
} from "@/app/GlobalRedux/Features/user/userSlicer";

type ModalUserProps = {
  modalId?: string;
  title?: string;
};

export const ModalAddUser = ({ modalId, title }: ModalUserProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // const handleSubmitCustomer = (e: any) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const data = Object.fromEntries(formData.entries());

  //   // dispatch(createUser(data)).then((res) => {
  //   //   if (res.payload) {
  //   //     Swal.fire({
  //   //       title: "Success",
  //   //       text: "User created",
  //   //       icon: "success",
  //   //     });
  //   //     (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
  //   //   }
  //   //   dispatch(fetchUsers());
  //   // });
  //   dispatch(createUser(data))
  //     .unwrap()
  //     .then((res) => {
  //       if (res) {
  //         Swal.fire({
  //           title: "Success",
  //           text: "User created",
  //           icon: "success",
  //         });
  //         (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
  //       }
  //       dispatch(fetchUsers());
  //     });
  // };
  return (
    <>
      <button
        className="btn bg-blue-600 text-slate-100 focus:bg-blue-700 hover:bg-blue-700"
        onClick={() =>
          (
            document.getElementById(`${modalId}`) as HTMLDialogElement
          ).showModal()
        }
      >
        <PlusCircleIcon />
        <span>{title}</span>
      </button>
      <ModalComponent
        modalId={modalId}
        modalHeader="Add new user"
        modalWrapper="p-0"
        backgroundColorHeader="bg-blue-700 text-white px-6 py-5"
        modalBodyStyle="pt-3 px-6 pb-6"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            dispatch(createUser(data))
              .unwrap()
              .then((res) => {
                if (res) {
                  Swal.fire({
                    title: "Success",
                    text: "User created",
                    icon: "success",
                  });
                  (
                    document.getElementById(`${modalId}`) as HTMLDialogElement
                  ).close();
                  (e.target as HTMLFormElement).reset();
                }
                dispatch(fetchUsers());
              });
          }}
        >
          <div className="mb-1">
            <FormIinput
              label="Username"
              inputName="username"
              inputType="text"
              placeholder="Input username here"
              labelStyle="text-slate-900 font-semibold text-sm"
              inputStyle="input input-bordered h-10"
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
              autoFocus={false}
            />
          </div>
          <div className="flex items-center justify-end gap-1 mt-4">
            <button
              className="btn bg-slate-300"
              type="button"
              onClick={() =>
                (
                  document.getElementById(`${modalId}`) as HTMLDialogElement
                ).close()
              }
            >
              Cancel
            </button>
            <button className="btn bg-blue-700 text-white hover:bg-blue-800">
              Submit
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
};
