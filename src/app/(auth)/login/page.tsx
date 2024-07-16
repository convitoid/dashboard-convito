"use client";
import { Card } from "@/components/card";
import { FormIinput } from "@/components/formInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import InputErrorMessage from "@/components/error/inputErrorMessage";
import { loginValidation } from "@/utils/formValidation";

const LoginPage = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUsernameError, setUsernameError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let username = formData.get("username")?.toString() ?? "";
    let password = formData.get("password")?.toString() ?? "";

    // validate input
    const validateUsername = loginValidation({ input: username });
    const validatePassword = loginValidation({ input: password });

    validateUsername.isValidate
      ? setUsernameError(false)
      : setUsernameError(true);
    validatePassword.isValidate
      ? setPasswordError(false)
      : setPasswordError(true);

    const sanitizeInputData = {
      username: sanitizeHtml(formData.get("username")?.toString() ?? ""),
      password: sanitizeHtml(formData.get("password")?.toString() ?? ""),
    };

    try {
      setLoading(true);
      await signIn("credentials", {
        redirect: false,
        username: sanitizeInputData.username,
        password: sanitizeInputData.password,
        callbackUrl: "/dashboard",
      }).then((res) => {
        setLoading(false);
        console.log(res);
        push("/dashboard");
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Card
      title="Sign in to your account"
      cardTitleStyle="text-slate-100 text-xl lg:text-3xl font-semibold mb-5"
      cardWrapper="bg-base-300 w-full lg:w-2/4 2xl:w-1/4 shadow-xl px-2 py-4"
    >
      <form onSubmit={(e) => handleLogin(e)}>
        <div className="mb-3 lg:mb-3">
          <FormIinput
            label="Username"
            inputName="username"
            inputType="text"
            placeholder="Input your username"
            labelStyle="text-slate-100 font-semibold text-sm lg:text-[1.05rem]"
            inputStyle="input input-bordered h-10 lg:h-12 xl:h-14"
            autoFocus={true}
          />
          {isUsernameError && (
            <InputErrorMessage
              message="Username is required"
              color="text-red-500"
              id="username-error"
            />
          )}
        </div>

        <div className=" mb-0 lg:mb-1">
          <FormIinput
            label="Password"
            inputName="password"
            inputType="password"
            placeholder="••••••••"
            labelStyle="text-slate-100 font-semibold text-sm lg:text-[1.05rem]"
            inputStyle="input input-bordered h-10 lg:h-12 xl:h-14"
          />
          {isPasswordError && (
            <InputErrorMessage
              message="Username is required"
              color="text-red-500"
              id="password-error"
            />
          )}
        </div>

        <div className="card-actions mt-4">
          {loading ? (
            <button className="btn btn-primary w-full btn-disabled">
              <span className="loading loading-spinner"></span>
              Signing in...
            </button>
          ) : (
            <button className="btn btn-primary w-full">Sign in</button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LoginPage;
