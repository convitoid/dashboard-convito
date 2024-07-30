"use client";

import Swal from "sweetalert2";
import { FormIinput } from "../formInput";
import { PlusCircleIcon } from "../icons/plusCircle";
import { ModalComponent } from "../modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  createUser,
  fetchUsers,
} from "@/app/GlobalRedux/Features/user/userSlicer";
import React, { useState } from "react";

type ModalUserProps = {
  modalId?: string;
  title?: string;
};

export const ModalAddUser = ({ modalId, title }: ModalUserProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.users.status);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  let newData = {
    ...formData,
    updatedBy: "admin",
    createdBy: "admin",
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    try {
      dispatch(createUser(newData))
        .unwrap()
        .then((res) => {
          console.log("response", res);
          if (res.status === 201) {
            Swal.fire({
              title: "Success",
              text: "User created successfully",
              icon: "success",
            });
            (
              document.getElementById(`${modalId}`) as HTMLDialogElement
            ).close();
            dispatch(fetchUsers());
          }

          if (res.status === 400) {
            // capitalize first letter

            Swal.fire({
              title: "Error",
              html: `${res.error}`,
              icon: "error",
              target: document.getElementById(`${modalId}`),
            });
            dispatch(fetchUsers());
            setFormData({
              username: "",
              email: "",
              password: "",
            });
          }
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to create user",
        icon: "error",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const closeModalEdit = () => {
    (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

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
        closeModal={closeModalEdit}
      >
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="mb-1">
            <FormIinput
              label="Username"
              inputName="username"
              inputType="text"
              placeholder="Input username here"
              labelStyle="text-slate-900 font-semibold text-sm"
              inputStyle="input input-bordered h-10"
              autoFocus={true}
              value={formData.username}
              onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-end gap-1 mt-4">
            <button
              className="btn bg-slate-300"
              type="button"
              onClick={() => closeModalEdit()}
            >
              Cancel
            </button>
            <button
              className={`btn bg-blue-700 text-white hover:bg-blue-800 `}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
};
