"use client";
import { Card } from "@/components/card";
import { FormIinput } from "@/components/formInput";

const LoginPage = () => {
  const handleLogin = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const loginData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    console.log(loginData);
  };
  return (
    <Card
      title="Sign in to your account"
      cardTitleStyle="text-slate-100 text-xl lg:text-3xl font-semibold mb-5"
      cardWrapper="bg-base-300 w-full lg:w-2/4 2xl:w-1/4 shadow-xl px-2 py-4"
    >
      <form onSubmit={(e) => handleLogin(e)}>
        <FormIinput
          label="Username"
          inputName="username"
          inputType="text"
          placeholder="Input your username"
          labelStyle="text-slate-100 font-semibold text-sm lg:text-[1.05rem] mb-0 lg:mb-1"
          inputStyle="input input-bordered mb-4 h-10 lg:h-12 xl:h-14"
        />
        <FormIinput
          label="Password"
          inputName="password"
          inputType="password"
          placeholder="••••••••"
          labelStyle="text-slate-100 font-semibold text-sm lg:text-[1.05rem] mb-0 lg:mb-1"
          inputStyle="input input-bordered mb-4 h-10 lg:h-12 xl:h-14"
        />
        <div className="card-actions mt-4">
          <button className="btn btn-primary w-full">Sign in</button>
        </div>
      </form>
    </Card>
  );
};

export default LoginPage;
