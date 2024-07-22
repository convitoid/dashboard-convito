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
    href: "/dashboard",
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
    <div className="px-8 2md:px-0">
      <div className="flex justify-end mb-3">
        <BreadcrumbsComponent data={breadcrumbsData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <div className="col-span-1">
          <Card cardWrapper="bg-blue-400 text-white">
            <h2 className="2md:text-[1rem] font-semibold">Total Customers</h2>
            <div className="flex items-center gap-3 text-2xl">
              <UsersIcon />
              <span>80</span>
            </div>
          </Card>
        </div>
        <div className="col-span-1">
          <Card cardWrapper="bg-blue-400 text-white">
            <h2 className="2md:text-[1rem] font-semibold">Total Guests</h2>
            <div className="flex items-center gap-3 text-2xl">
              <UserGroupIcon />
              <span>80</span>
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-semibold text-sm lg:text-lg xl:text-xl">
            Cenvito customers statistics
          </h1>
          <select
            name="customers_statistics_year"
            id="cusomers_statistics_year"
            className="select select-bordered w-full max-w-xs"
            defaultValue={""}
          >
            <option disabled={true} value={""}>
              Select statistics year
            </option>
            <option value="2024">2024</option>
          </select>
        </div>
        <BarChart />
      </div>
    </div>
  );
};

export default DashboardPage;
