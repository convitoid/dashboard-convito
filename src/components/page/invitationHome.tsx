"use client";
import {
  confirmInvitation,
  fetchInvitation,
} from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import { AppDispatch } from "@/app/store";
import prisma from "@/libs/prisma";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

interface InvitationHomeProps {
  invitations: any;
}

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const InvitationHome = ({ invitations }: InvitationHomeProps) => {
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const splitTitle = invitations.data.eventName.split(" of ");
  console.log(invitations);
  const dispatch = useDispatch<AppDispatch>();

  const submitConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionId = invitations?.data?.questions
      .slice(0, 1)
      .map((question: any) => question.id);

    const data = Object.fromEntries(formData.entries());
    const newData = {
      ...data,
      questionId: questionId[0],
    };

    if (!data?.confirm_invitation) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please select your confirmation",
      });
      return;
    }

    dispatch(confirmInvitation(newData as any))
      .unwrap()
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your confirmation has been sent",
        });

        dispatch(fetchInvitation(invitations.data.clientId));
      });
  };

  const checkConfirm = invitations?.data?.questions
    .slice(0, 1)
    .filter((question: { answer: string }) => question.answer === "yes");
  console.log("filteredData", checkConfirm);

  useEffect(() => {
    if (checkConfirm.length > 0) {
      setIsConfirm(true);
    } else {
      setIsConfirm(false);
    }
  }, [checkConfirm.length]);

  return (
    <>
      {isConfirm ? (
        <div className="">
          <div className="bg-slate-900 bg-opacity-55 backdrop-blur-lg h-full text-slate-100">
            <Image
              src={"/assets/images/wedding-image.jpg"}
              width={150}
              height={90}
              className="w-full h-full shadow-slate-900/50 shadow-sm fade-in"
              alt="wedding-foto"
            />
            <h1>{`Dear, ${invitations.data.clientName}`}</h1>
            {invitations.data.questions
              .filter(
                (question: { answer: string }) => question.answer !== "yes"
              )
              .map((question: any, index: number) => (
                <div key={question.id}>
                  <label htmlFor={`question${question.id}`}>
                    {question.question}
                  </label>
                  <input type={question.type} name={question.id} />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center mb-14">
            <Image
              src={"/assets/images/wedding-couple.jpg"}
              width={90}
              height={90}
              className="h-[15rem] w-[11rem] object-center rounded-lg shadow-black shadow-md mb-4 fade-in"
              alt="wedding-foto"
            />
            <h1
              className={`${dancingScript.className} text-xl text-white mb-1 slide-up`}
            >
              {splitTitle[0]} of
            </h1>
            <h2
              className={`${dancingScript.className} text-2xl text-white font-semibold mb-1 text-center slide-up`}
            >
              {splitTitle[1]}
            </h2>
            <h2
              className={`${dancingScript.className} text-[13px] text-white slide-up`}
            >
              Sunday, 12 December 2024
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1
              className={`${dancingScript.className} text-white font-bold mb-7 slide-up text-xl`}
            >
              Dear, Mr.{invitations.data.clientName}
            </h1>
            <form
              className="flex flex-col items-center"
              onSubmit={submitConfirm}
            >
              {invitations.data.questions
                .slice(0, 1)
                .map((question: any, index: number) => (
                  <div key={question.id} className="flex flex-col w-3/4">
                    <label
                      htmlFor="confirmation_of_attendance"
                      className="text-white mb-3 slide-up text-center text-[13px] font-semibold"
                    >
                      {question.question}
                    </label>
                    <div className="flex flex-row items-center justify-center gap-5 slide-up">
                      <div className="form-control flex flex-row items-center gap-2">
                        <input
                          type="radio"
                          className="radio radio-info radio-sm"
                          name="confirm_invitation"
                          id="yes"
                          value={"yes"}
                        />
                        <label
                          htmlFor="yes"
                          className="label-text text-white font-semibold"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-control flex flex-row items-center gap-2">
                        <input
                          type="radio"
                          className="radio radio-info radio-sm"
                          name="confirm_invitation"
                          id="no"
                          value={"no"}
                        />
                        <label
                          htmlFor="no"
                          className="label-text text-white font-semibold"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-slate-100 px-4 py-3 rounded-md mt-8 slide-up w-full">
                      Confirm
                    </button>
                  </div>
                ))}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
