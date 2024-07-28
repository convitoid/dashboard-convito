"use client";
import Image from "next/image";
import { useState } from "react";

interface InvitationHomeProps {
  invitations: any;
}

export const InvitationHome = ({ invitations }: InvitationHomeProps) => {
  const [selectConfirmation, setSelectConfirmation] = useState("");
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-14">
        <Image
          src={"/assets/images/wedding-couple.jpg"}
          width={90}
          height={90}
          className="h-[15rem] w-[11rem] object-center rounded-lg shadow-black shadow-md mb-4 fade-in"
          alt="wedding-foto"
        />
        <h1 className="text-xl text-white mb-1 slide-up">The wedding of</h1>
        <h2 className="text-3xl text-white font-semibold mb-1 slide-up">
          {invitations.data.eventName}
        </h2>
        <h2 className="text-[13px] text-white slide-up">
          Sunday, 12 December 2024
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <form className="flex flex-col items-center ">
          <label
            htmlFor="confirmation_of_attendance"
            className="text-white font-semibold mb-2 slide-up"
          >
            Will you be attending the event?
          </label>
          <select
            name="confirmation_of_attendance"
            id="confirmation_of_attendance"
            className="select select-sm select-info backdrop-blur-md w-full max-w-lg slide-up"
            defaultValue={selectConfirmation}
          >
            <option value="">Are you attending?</option>
            <option value="y">Yes</option>
            <option value="y">No</option>
          </select>
          <button className="bg-blue-600 text-slate-100 px-4 py-3 rounded-md mt-8 slide-up">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
