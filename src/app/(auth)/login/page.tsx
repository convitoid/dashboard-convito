'use client';
import { Card } from '@/components/card';
import { FormIinput } from '@/components/formInput';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import InputErrorMessage from '@/components/error/inputErrorMessage';
import { loginValidation } from '@/utils/formValidation';
import Swal from 'sweetalert2';

const LoginPage = () => {
   const { push } = useRouter();
   const [loading, setLoading] = useState(false);
   const [isUsernameError, setUsernameError] = useState(false);
   const [isPasswordError, setPasswordError] = useState(false);

   const handleLogin = async (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let username = formData.get('username')?.toString() ?? '';
      let password = formData.get('password')?.toString() ?? '';

      // validate input
      const validateUsername = loginValidation({ input: username });
      const validatePassword = loginValidation({ input: password });

      validateUsername.isValidate ? setUsernameError(false) : setUsernameError(true);
      validatePassword.isValidate ? setPasswordError(false) : setPasswordError(true);

      const sanitizeInputData = {
         username: sanitizeHtml(formData.get('username')?.toString() ?? ''),
         password: sanitizeHtml(formData.get('password')?.toString() ?? ''),
      };

      try {
         setLoading(true);
         const res = await signIn('credentials', {
            redirect: false,
            username: sanitizeInputData.username,
            password: sanitizeInputData.password,
            callbackUrl: '/dashboard',
         });

         if (res?.error) {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Invalid username or password',
            });
            setLoading(false);
         } else {
            setLoading(false);
            push('/dashboard');
         }
      } catch (error) {
         console.error('An error occurred:', error);
      }
   };

   useEffect(() => {
      window.document.title = 'Convito - Login';
   }, []);

   return (
      <Card cardWrapper="bg-[#1c1c1c] w-full 2md:w-2/4 lg:w-1/4 xl:w-1/4 shadow-xl px-2 py-4">
         <h2 className={`card-title text-slate-100 text-xl lg:text-2xl font-semibold mb-5`}>Sign In To Your Account</h2>

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
            </div>

            <div className="card-actions mt-8">
               {loading ? (
                  <button className="bg-slate-700 w-full text-slate-200 hover:text-slate-900 border-none py-4 rounded-md cursor-pointer">
                     <span className="loading loading-spinner"></span>
                  </button>
               ) : (
                  <button className="btn btn-primary w-full">Sign In</button>
               )}
            </div>
         </form>
      </Card>
   );
};

export default LoginPage;
