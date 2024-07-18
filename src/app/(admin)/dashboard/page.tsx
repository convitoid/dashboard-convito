"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "Cenvito - Dashboard";
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default DashboardPage;
