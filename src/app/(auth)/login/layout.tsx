"use client";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const LoginLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="flex justify-center items-center h-screen px-4 md:px-10 lg:px-0">
      {children}
    </main>
  );
};

export default LoginLayout;
