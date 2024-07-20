"use client";

import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { Card } from "@/components/card";
import { BarChart } from "@/components/chart/barchart";
import { UserGroupIcon } from "@/components/icons/userGroup";
import { UsersIcon } from "@/components/icons/users";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const breadcrumbsData = [
  {
    name: "dashboard",
    href: "/",
  },
  {
    name: "statistics",
    href: "",
  },
];

const DashboardPage = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    document.title = "Cenvito - Dashboard";
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-3">
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">
          <Card cardWrapper="bg-blue-400 text-white">
            <h2 className="card-title">Total Customers</h2>
            <div className="flex items-center gap-3 text-2xl">
              <UsersIcon />
              <span>80</span>
            </div>
          </Card>
        </div>
        <div className="col-span-1">
          <Card cardWrapper="bg-blue-400 text-white">
            <h2 className="card-title">Total Guests</h2>
            <div className="flex items-center gap-3 text-2xl">
              <UserGroupIcon />
              <span>80</span>
            </div>
          </Card>
        </div>
        <div className="col-span-1"></div>
      </div>
      <div className="">
        <BarChart />
      </div>
    </>
  );
};

export default DashboardPage;
