"use client";

import React, { useState } from "react";
import { FormIinput } from "../formInput";
import { PlusCircleIcon } from "../icons/plusCircle";
import { ModalComponent } from "../modal";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Xicon } from "@/components/icons/xicon";
import { uploadImage } from "@/app/GlobalRedux/Thunk/clients/clientUploadImageThunk";
import {
  createCLient,
  deleteClient,
  fetchClients,
} from "@/app/GlobalRedux/Thunk/clients/clientThunk";
import { createValidation } from "@/utils/formValidation/user/createValidation";
import { createClientValidation } from "@/utils/formValidation/clients/createValidation";

type ModalAddClientProps = {
  modalId?: string;
  title?: string;
};

export const ModalAddClient = ({ modalId, title }: ModalAddClientProps) => {
  const [formData, setFormData] = useState({
    client_name: "",
    event_name: "",
    event_date: "",
    event_type: "",
    image: null as unknown as string | File,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);
  const [uploadImageUrl, setUploadImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [lastModified, setLastModified] = useState<string>("");
  const [fileSize, setFileSize] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const statusClient = useSelector(
    (state: RootState) => state.clients.statusAdd
  );
  const statusUploadImage = useSelector(
    (state: RootState) => state.uploadImage.status
  );

  const handleSubmitClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    const validation = createClientValidation(formData);

    if (Object.keys(validation).length > 0) {
      const key = Object.keys(validation)[0];
      // delete _ from key and convert to snake case
      const snakeCaseKey = key.replace("_", " ");
      // convert to Camel case
      const camelCaseKey = snakeCaseKey.replace(/(\b\w)/gi, (m) =>
        m.toUpperCase()
      );

      return Swal.fire({
        icon: "info",
        title: "Validation error",
        text: `${camelCaseKey} is required`,
        target: document.getElementById(`${modalId}`),
      });
    }

    formData.event_date = new Date(formData.event_date).toISOString();

    let newFormData = {
      ...formData,
      updatedBy: session?.user?.name,
      createdBy: session?.user?.name,
    };

    if (file) {
      newFormData = { ...newFormData, image: file };
    }

    const createClient = await dispatch(createCLient(newFormData));

    if (createClient.payload.status !== 201) {
      return Swal.fire({
        icon: "info",
        title: "Error",
        text: "Failed to create client",
        target: document.getElementById(`${modalId}`),
      });
    }

    const clientId = createClient.payload.data.id;
    const clientCode = createClient.payload.data.client_id;

    const imageFormData = new FormData();
    imageFormData.append("client_image", newFormData.image as Blob);
    imageFormData.append("client_code", clientCode);
    imageFormData.append("client_id", clientId);

    const uploadImageRes = await dispatch(uploadImage(imageFormData));
    console.log("uploadImageRes", uploadImageRes);
    if (uploadImageRes.payload.status === 400) {
      await dispatch(deleteClient(clientId));
      return Swal.fire({
        icon: "info",
        title: "Error",
        text: "Image is required",
        target: document.getElementById(`${modalId}`),
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Client created successfully",
      target: document.getElementById(`${modalId}`),
    }).then(() => {
      dispatch(fetchClients());
      closeModal();
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("file", file);
      setIsUpLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const uploadSimulation = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(uploadSimulation);
              setIsUpLoading(false);
              if (e.target) {
                setUploadImageUrl(e.target.result as string);
                setImageName(file.name);
                const lastModified = new Date(file.lastModified);
                setLastModified(lastModified.toDateString());
                const fileSize = file.size / 1048576;
                setFileSize(Number(fileSize.toFixed(2)));
                setFormData({ ...formData, image: file });

                let imageBlob: Blob;
                if (e.target.result instanceof ArrayBuffer) {
                  imageBlob = new Blob([new Uint8Array(e.target.result)]);
                } else {
                  imageBlob = new Blob([e.target.result as string]);
                }
              }
            }
            return prev + 10;
          });
        }, 200);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadImageUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModal = () => {
    (document.getElementById(`${modalId}`) as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
    // clear form data
    setFormData({
      client_name: "",
      event_name: "",
      event_date: "",
      event_type: "",
      image: "",
    });

    setUploadImageUrl("");
    setUploadProgress(0);
    setIsUpLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <button
        className="btn bg-blue-600 text-slate-100 focus:bg-blue-700 hover:bg-blue-700"
        onClick={openModal}
      >
        <PlusCircleIcon />
        <span>{title}</span>
      </button>
      <ModalComponent
        modalId={modalId}
        modalHeader="Add new client"
        modalWrapper="p-0 w-11/12 max-w-xl"
        backgroundColorHeader="bg-blue-700 text-white px-6 py-5"
        modalBodyStyle="pt-3 px-6 pb-6"
        closeModal={closeModal}
      >
        <form onSubmit={(e) => handleSubmitClient(e)}>
          <div className="md:flex md:flex-wrap md:gap-2">
            <div className="mb-1 md:flex-grow">
              <FormIinput
                label="Client Name"
                inputName="client_name"
                inputType="text"
                placeholder="e.g. John Doe"
                labelStyle="text-slate-900 font-semibold text-sm"
                inputStyle="input input-bordered h-10"
                value={formData.client_name}
                onChange={handleInputChange}
                autoFocus={true}
              />
            </div>
            <div className="mb-1 md:flex-grow">
              <FormIinput
                label="Event Name"
                inputName="event_name"
                inputType="text"
                labelStyle="text-slate-900 font-semibold text-sm"
                inputStyle="input input-bordered h-10"
                placeholder="e.g. Wedding of John Doe"
                value={formData.event_name}
                onChange={handleInputChange}
                autoFocus={false}
              />
            </div>
          </div>

          <div className="md:flex md:flex-wrap md:gap-2">
            <div className="mb-1 md:flex-grow">
              <FormIinput
                label="Event Date"
                inputName="event_date"
                inputType="datetime-local"
                labelStyle="text-slate-900 font-semibold text-sm"
                inputStyle="input input-bordered h-10"
                value={formData.event_date}
                onChange={handleInputChange}
                autoFocus={false}
              />
            </div>
            <div className="mb-1 md:flex-grow">
              <FormIinput
                label="Event Type"
                inputName="event_type"
                inputType="text"
                labelStyle="text-slate-900 font-semibold text-sm"
                inputStyle="input input-bordered h-10"
                placeholder="e.g. Wedding, Birthday, etc."
                value={formData.event_type}
                onChange={handleInputChange}
                autoFocus={false}
              />
            </div>
          </div>
          <div>
            <label htmlFor="upload_image" className="form-control w-full">
              <div className="label">
                <span className="text-slate-900 font-semibold text-sm">
                  Upload Image
                </span>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="file-input file-input-bordered w-full"
                name="upload_image"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            {isUpLoading && (
              <div className="mt-3">
                <div className="-mb-1 flex items-center justify-between">
                  <h1 className="text-sm">Uploading image...</h1>
                  <h1 className="text-sm"> {uploadProgress} %</h1>
                </div>
                <progress
                  className="progress progress-info w-full"
                  value={uploadProgress}
                  max={100}
                ></progress>
              </div>
            )}
            {uploadImageUrl && (
              <div className="border-[1px] border-gray-300 mt-2 px-2 py-2 rounded-md flex gap-3 relative">
                <Image
                  src={uploadImageUrl}
                  alt="upload preview"
                  width={500}
                  height={500}
                  className="w-36 h-24 rounded-md"
                  priority
                />
                <div className="py-1 ">
                  <p className="text-slate-900 font-semibold text-[14px]">
                    {imageName}
                  </p>
                  <p className="text-slate-500 text-sm">
                    Last modified: {lastModified}
                  </p>
                  <p className="text-slate-500 text-sm">
                    File size: {fileSize} MB
                  </p>

                  <button
                    type="button"
                    className="bg-red-500/90 rounded-full p-1 text-white hover:bg-red-500 transition duration-150 ease-in absolute top-0 right-0 translate-y-1 -translate-x-1 tooltip tooltip-left"
                    data-tip="Delete image"
                    onClick={handleRemoveImage}
                  >
                    <Xicon className="size-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-1 mt-4">
            <button
              className="btn bg-slate-300"
              type="button"
              onClick={closeModal}
              disabled={
                isUpLoading ||
                statusClient === "loading" ||
                statusUploadImage === "loading"
              }
            >
              Cancel
            </button>
            <button
              className="btn bg-blue-700 text-white hover:bg-blue-800"
              disabled={
                isUpLoading ||
                statusClient === "loading" ||
                statusUploadImage === "loading"
            }
            >
              {statusClient === "loading" || statusUploadImage === "loading" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  );
};
