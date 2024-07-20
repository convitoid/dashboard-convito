"use client";

import { signOut, useSession } from "next-auth/react";
import { DrawerComponent } from "../drawer";
import { usePathname, useRouter } from "next/navigation";
import { SkeletonComponent } from "../skeleton";
import { ProfileDropdownComponent } from "../dropdown/profileDropdown";
import { useEffect } from "react";

export const NavbarComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  //   hilangkan / dari pathname
  const activePath = pathname.replace("/", "");
  //   get 2 char from name
  const name = session?.user?.name ?? "";
  const initial = name.slice(0, 2);

  const logout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      router.push("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onScrollNavbar = () => {
    const navbar = document.querySelector("nav");
    console.log(window.scrollY);

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
    <nav className="border-b-[1px] bg-white border-slate-200 fixed top-0 2md:w-[76%] lg:w-[76%] xl:w-[81%] transition duration-200 ease-in">
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
                <button onClick={() => logout()}>Logout</button>
              </li>
            </ProfileDropdownComponent>
          )}
        </div>
      </div>
    </nav>
  );
};
