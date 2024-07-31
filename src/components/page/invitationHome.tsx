"use client";
import {
  confirmInvitation,
  fetchInvitation,
  putAnswer,
} from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import { AppDispatch, RootState } from "@/app/store";
import prisma from "@/libs/prisma";
import { Dancing_Script, Pacifico } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

interface InvitationHomeProps {
  invitations: any;
}

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

const paficifo = Pacifico({
  weight: ["400"],
  display: "swap",
  subsets: ["latin"],
});

export const InvitationHome = ({ invitations }: InvitationHomeProps) => {
  console.log("invitations", invitations);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isAnswer, setIsAnswer] = useState<boolean>(false);
  const [isAnswerYes, setIsAnswerYes] = useState<boolean>(false);
  const splitTitle = invitations?.data?.eventName.split(" of ");
  const dispatch = useDispatch<AppDispatch>();

  const submitConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionId = invitations?.data?.questions
      .filter(
        (question: { flag: string }) => question.flag === "confirm_question"
      )
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

  const checkConfirm = invitations?.data?.questions.filter(
    (question: { answer: string; flag: string }) =>
      question.answer === "yes" && question.flag === "confirm_question"
  );

  const submitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataForm = Object.fromEntries(formData.entries());
    const getIdKey = Object.keys(dataForm).filter((key) =>
      key.includes("question_")
    );
    const getId = getIdKey.map((key) => key.split("_")[1]);

    const newData = getId.map((id) => {
      return {
        questionId: id,
        answer: dataForm[`question_${id}`],
      };
    });

    newData.map(async (data) => {
      dispatch(putAnswer(data as any))
        .unwrap()
        .then((res) => {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Thank you for your answer",
          });
          dispatch(fetchInvitation(invitations.data.clientId));
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Please try again",
          });
        });
    });
  };

  useEffect(() => {
    if (checkConfirm?.length > 0) {
      setIsConfirm(true);
    } else {
      setIsConfirm(false);
    }
  }, [checkConfirm?.length]);

  useEffect(() => {
    invitations?.data?.questions.filter(
      (question: { answer: string; flag: string }) => {
        if (question.answer !== "yes" && question.flag !== "confirm_question") {
          invitations?.data?.questions.filter(
            (question: { answer: string; question: string }) => {
              if (question.answer === null) {
                setIsAnswer(false);
              } else {
                setIsAnswer(true);
              }
            }
          );
        }
      }
    );
  }, [invitations?.data?.questions]);

  const isAnswerYesY = invitations?.data?.questions.filter(
    (question: { answer: string; flag: string }) => question.answer === "no"
  );

  return (
    <>
      {isAnswerYesY.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className={`text-2xl text-white ${dancingScript.className}`}>
            Thank you for your answer
          </h1>
        </div>
      ) : (
        <>
          {isAnswer ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className={`text-2xl text-white ${dancingScript.className}`}>
                Thank you for your answer
              </h1>
            </div>
          ) : (
            <>
              {isConfirm ? (
                <div className="flex flex-col items-center h-full text-slate-100">
                  <div className="max-w-md">
                    <div className="bg-[url('/assets/images/wedding-image.jpg')] w-full h-56 bg-cover bg-center bg-no-repeat relative">
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
                        <div
                          className={`text-center ${dancingScript.className} fade-in`}
                        >
                          <h2 className="text-[20px] mb-1">
                            {splitTitle[0]} of
                          </h2>
                          <h2 className="text-xl font-semibold mb-1">
                            {splitTitle[1]}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={submitAnswer} className="px-4 py-6">
                      {invitations.data.questions
                        .filter(
                          (question: { answer: string; flag: string }) =>
                            question.answer !== "yes" &&
                            question.flag !== "confirm_question"
                        )
                        .map((question: any, index: number) => (
                          <div key={question.id} className="mb-5 flex flex-col">
                            <label
                              htmlFor={`question${question.id}`}
                              className="mb-3 text-md slide-up"
                            >
                              {question.question}
                            </label>
                            <input
                              type={`${question.type}`}
                              name={`question_${question.id}`}
                              className="text-slate-900 py-2 px-3 rounded-md slide-up"
                              autoFocus={index === 0 ? true : false}
                            />
                          </div>
                        ))}
                      <button className="bg-blue-600 text-slate-100 px-4 py-3 rounded-md slide-up w-full">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center mb-14">
                    <Image
                      src={"/assets/images/wedding-couple.jpg"}
                      width={200}
                      height={200}
                      className="h-[15rem] w-[11rem] object-center rounded-lg shadow-black shadow-md mb-4 fade-in"
                      alt="wedding-foto"
                    />
                    <h1
                      className={`${dancingScript.className} text-xl text-white mb-1 slide-up`}
                    >
                      {splitTitle ? `${splitTitle[0]} of` : ""}
                    </h1>
                    <h2
                      className={`${dancingScript.className} text-2xl text-white font-semibold mb-1 text-center slide-up`}
                    >
                      {splitTitle ? splitTitle[1] : ""}
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
                      Dear, Mr.
                      {invitations ? invitations?.data?.clientName : ""}
                    </h1>
                    <form
                      className="flex flex-col items-center"
                      onSubmit={submitConfirm}
                    >
                      {invitations ? (
                        <>
                          {invitations?.data?.questions
                            .filter(
                              (question: { flag: string }) =>
                                question.flag === "confirm_question"
                            )
                            .map((question: any, index: number) => (
                              <div
                                key={question.id}
                                className="flex flex-col w-3/4"
                              >
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
                        </>
                      ) : (
                        ""
                      )}
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
