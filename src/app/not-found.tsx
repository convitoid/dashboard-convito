"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { back } = useRouter();

  const goBack = () => {
    back();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h5 className="uppercase font-semibold text-slate-900 text-xl">
          oops! page not found
        </h5>
        <h1 className="font-bold text-9xl text-slate-900 mb-3">404</h1>
        <h4 className="uppercase font-light text-slate-900 mb-4">
          we are sorry, but the page you requested was not found
        </h4>
        <button className="btn btn-info uppercase" onClick={() => goBack()}>
          Go back
        </button>
      </div>
    </div>
  );
}
