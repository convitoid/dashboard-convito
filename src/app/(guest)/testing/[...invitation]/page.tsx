"use client";

import { fetchInvitation } from "@/app/GlobalRedux/Features/test/testBlastingSlicer";
import NotFound from "@/app/not-found";
import { AppDispatch, RootState } from "@/app/store";
import { InvitationHome } from "@/components/page/invitationHome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const GuestTestingPage = ({ params }: { params: { invitation: string } }) => {
  const [selectConfirmation, setSelectConfirmation] = useState("");
  const router = useRouter();

  const clientId = params.invitation[0];
  const dispatch = useDispatch<AppDispatch>();
  const invitations = useSelector(
    (state: RootState) => state.testBlasting.invitation
  );

  const status = useSelector((state: RootState) => state.testBlasting.status);

  if (invitations?.status === 404) {
    // return
    router.push("/404");
  }

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
              <InvitationHome invitations={invitations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestTestingPage;
