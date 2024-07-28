"use client";

import {
  fetchInvitation,
  putAnswerInvitation,
} from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import NotFound from "@/app/not-found";
import { AppDispatch, RootState } from "@/app/store";
import { Card } from "@/components/card";
import { InvitationHome } from "@/components/page/invitationHome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

interface Invitation {
  data: {
    eventName: string;
    clientId: string;
    statusCode: number;
    questions: any[];
  };
}

function isInvitation(obj: any): obj is Invitation {
  return obj && typeof obj === "object" && "data" in obj;
}

const GuestTestingPage = ({ params }: { params: { invitation: string } }) => {
  const [selectConfirmation, setSelectConfirmation] = useState("");
  const clientId = params.invitation[0];
  const dispatch = useDispatch<AppDispatch>();
  const invitations = useSelector(
    (state: RootState) => state.testBlasting.invitation
  );
  const status = useSelector((state: RootState) => state.testBlasting.status);

  useEffect(() => {
    dispatch(fetchInvitation(clientId));
  }, [clientId, dispatch]);

  useEffect(() => {
    document.title = "Convito - Reservations wedding and event";
  }, []);

  return (
    <div className="bg-[url('/assets/images/background.jpg')] bg-cover bg-center bg-fixed min-h-screen overflox-y-auto">
      <div
        className={`absolute inset-0 bg-gray-950 bg-opacity-60 backdrop-blur-sm`}
      >
        <div className="relative z-10">
          <div className="h-screen ">
            {status === "loading" || status === "idle" ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                {isInvitation(invitations) && (
                  <InvitationHome invitations={invitations} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestTestingPage;
