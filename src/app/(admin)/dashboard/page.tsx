"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  console.log(session);
  console.log(status);
  const logout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      push("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div>
      <h1>Dashboard Page</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default DashboardPage;
