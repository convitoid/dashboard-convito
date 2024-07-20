"use client";

import { signOut, useSession } from "next-auth/react";
import { DrawerComponent } from "../drawer";
import { usePathname, useRouter } from "next/navigation";
import { SkeletonComponent } from "../skeleton";
import { ProfileDropdownComponent } from "../dropdown/profileDropdown";
import { useEffect, useState } from "react";

export const NavbarComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // pathname to array
  const pathArray = pathname.split("/");
  // remove "" from array
  pathArray.shift();

  // get the last item in the array
  const activePath = pathArray[pathArray.length - 1];

  const name = session?.user?.name ?? "";
  const initial = name.slice(0, 2);

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: true, callbackUrl: "/login" });
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const onScrollNavbar = () => {
    const navbar = document.querySelector("nav");

    if (window.scrollY > 10) {
      navbar?.classList.add("bg-white");
    } else {
      navbar?.classList.remove("bg-white");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScrollNavbar);

    return () => {
      window.removeEventListener("scroll", onScrollNavbar);
    };
  }, []);

  return (
    <nav className="border-b-[1px] bg-white border-slate-200 fixed top-0 z-10 w-full px-8 2md:px-0 2md:w-[76%] lg:w-[76%] xl:w-[81%] transition duration-200 ease-in">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center justify-between gap-3">
          <DrawerComponent />
          <h1 className="text-slate-900 uppercase font-semibold text-lg lg:text-2xl">
            {activePath}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-900">
            {status === "loading" ? <SkeletonComponent /> : name}
          </span>
          {status === "loading" ? (
            <div className="skeleton h-9 w-9 shrink-0 rounded-full bg-slate-600"></div>
          ) : (
            <ProfileDropdownComponent initial={initial}>
              <li>
                <button
                  onClick={() => logout()}
                  className={`focus:text-slate-100 ${
                    isLoading ? "cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ProfileDropdownComponent>
          )}
        </div>
      </div>
    </nav>
  );
};
