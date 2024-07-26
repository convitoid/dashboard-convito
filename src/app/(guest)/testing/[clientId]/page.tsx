"use client";

import { fetchInvitation } from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import { AppDispatch, RootState } from "@/app/store";
import { Card } from "@/components/card";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Invitation {
  data: {
    eventName: string;
    clientId: string;
    questions: any[];
  };
}

function isInvitation(obj: any): obj is Invitation {
  return obj && typeof obj === "object" && "data" in obj;
}

const GuestTestingPage = ({ params }: { params: { clientId: string } }) => {
  const { clientId } = params;
  const dispatch = useDispatch<AppDispatch>();
  const invitations = useSelector(
    (state: RootState) => state.testBlasting.invitation
  );
  const status = useSelector((state: RootState) => state.testBlasting.status);

  useEffect(() => {
    dispatch(fetchInvitation(clientId));
  }, [clientId, dispatch]);

  console.log(
    "dari page",
    isInvitation(invitations) ? invitations.data.questions : null
  );

  const submitAnswers = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const answers = isInvitation(invitations)
      ? invitations.data.questions.map((question) => {
          return {
            questionId: question.id,
            answer: formData.get(`question${question.id}`),
          };
        })
      : [];
    console.log(answers);
  };

  return (
    <>
      {status === "loading" || status === "idle" ? (
        <div className="h-screen flex items-center justify-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div className="max-w-lg mx-auto px-2 py-2">
          <Image
            src={"/assets/images/wedding-image.jpg"}
            width={500}
            height={500}
            alt="Wedding Image"
            className="rounded-md w-full h-[17rem]"
            loading="lazy"
          />

          {isInvitation(invitations) ? (
            <>
              <div className="bg-gray-100 my-3 p-3 rounded-md text-center text-lg font-semibold">
                <h1>{invitations.data.eventName}</h1>
              </div>
              <div className="bg-gray-100 my-3 p-3 rounded-md ">
                {invitations.data.questions.filter(
                  (question) => !question.answer
                ).length > 0 ? (
                  <form onSubmit={(e) => submitAnswers(e)}>
                    {invitations.data.questions
                      .filter((question) => !question.answer)
                      .map((question, index) => (
                        <div key={question.id} className="mb-4">
                          <span className="text-md font-semibold">
                            {question.question}
                          </span>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`question${question.id}`}
                                id={`y${question.id}`}
                                value="Y"
                              />
                              <label htmlFor={`y${question.id}`}>Yes</label>
                            </div>
                            <div className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`question${question.id}`}
                                id={`n${question.id}`}
                                value="N"
                              />
                              <label htmlFor={`n${question.id}`}>No</label>
                            </div>
                          </div>
                        </div>
                      ))}
                    <button className="btn btn-primary mt-3 w-full">
                      Submit
                    </button>
                  </form>
                ) : (
                  <h1 className="text-center text-lg font-semibold h-full">
                    Thank you for your answer
                  </h1>
                )}
              </div>
            </>
          ) : (
            "No event name available"
          )}
        </div>
      )}
    </>
  );
};

export default GuestTestingPage;
