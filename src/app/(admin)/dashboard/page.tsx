"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // if (status === "unauthenticated" || !session) {
  //   router.push("/");
  // }

  const logout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      router.push("/");
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
