'use client';
import { fetchInvitation, putAnswer } from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import { AppDispatch, RootState } from '@/app/store';
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

interface InvitationHomeProps {
   invitations: any;
}

const robotoFont = Roboto({
   weight: ['100', '300', '400', '500', '700', '900'],
   display: 'swap',
   subsets: ['latin'],
});

export const InvitationHome = ({ invitations }: InvitationHomeProps) => {
   console.log(invitations);
   const [isAnswer, setIsAnswer] = useState<boolean>(false);
   const [disabled, setDisabled] = useState<boolean>(true);
   const [formValues, setFormValues] = useState<any>({});
   const [isInvalid, setIsInvalid] = useState<any>({});

   const eventName = invitations?.data?.eventName || '';
   const [firstLine, ...secondLine] = eventName.split(' of ');
   const dispatch = useDispatch<AppDispatch>();
   const status = useSelector((state: RootState) => state.testBlasting.status);

   const submitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const dataForm = Object.fromEntries(formData.entries());
      const getIdKey = Object.keys(dataForm).filter((key) => key.includes('question_'));
      const getId = getIdKey.map((key) => key.split('_')[1]);
      console.log(getId);

      // jika terdapat jawaban no
      const isNo = getId.some((id) => dataForm[`question_${id}`] === 'no');

      if (isNo) {
         const newData = getId.map((id) => {
            return {
               questionId: id,
               answer: dataForm[`question_${id}`],
            };
         });

         newData.map(async (data) => {
            dispatch(putAnswer(data as any))
               .unwrap()
               .then((res) => {
                  console.log('res', res);
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Thank you for your answer',
                  });
                  dispatch(fetchInvitation(invitations.data.clientId));
               })
               .catch((err) => {
                  console.log(err);
                  Swal.fire({
                     icon: 'error',
                     title: 'Failed',
                     text: 'Please try again',
                  });
               });
         });
      } else {
         const missingFields = getId.filter((id) => dataForm[`question_${id}`]);

         console.log(missingFields.length, invitations?.data?.questions?.length);
         if (missingFields.length !== invitations?.data?.questions?.length) {
            return Swal.fire({
               icon: 'error',
               title: 'Failed',
               text: 'Please fill all fields',
            });
         }

         const newData = getId.map((id) => {
            return {
               questionId: id,
               answer: dataForm[`question_${id}`],
            };
         });

         newData.map(async (data) => {
            dispatch(putAnswer(data as any))
               .unwrap()
               .then((res) => {
                  console.log(res);
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Thank you for your answer',
                  });
                  dispatch(fetchInvitation(invitations.data.clientId));
               })
               .catch((err) => {
                  console.log(err);
                  Swal.fire({
                     icon: 'error',
                     title: 'Failed',
                     text: 'Please try again',
                  });
               });
         });
      }
   };

   useEffect(() => {
      const filterByAnswer = invitations?.data?.questions?.filter(
         (answer: { answer: string }) => answer.answer === null
      );

      if (filterByAnswer?.length === invitations?.data?.questions?.length) {
         setIsAnswer(true);
      }
   }, [invitations?.data?.questions]);

   const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value === 'no' ? setDisabled(true) : setDisabled(false);
   };

   const handleChangeInput = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const name = event.target.name;
      let valid = true;

      if (type === 'number') {
         // Validasi input hanya berupa angka tanpa karakter "-", "+", atau "e"
         if (!/^\d*$/.test(value)) {
            valid = false;
         }

         // Batasi panjang input angka hingga 3 digit
         if (value.length > 3) {
            valid = false;
         }

         // Potong nilai ke 3 digit jika panjang lebih dari 3
         const trimmedValue = value.slice(0, 3);

         // Set value to 0 if the value is not valid or parseInt is NaN
         const parsedValue = parseInt(trimmedValue);
         setFormValues({
            ...formValues,
            [name]: isNaN(parsedValue) ? 0 : parsedValue,
         });
      } else if (type === 'text') {
         // Validasi input hanya berupa teks (tanpa angka) boleh - dan /
         if (!/^[a-zA-Z\s-\/]*$/.test(value)) {
            valid = false;
         }

         setFormValues({
            ...formValues,
            [name]: value,
         });
      }

      setIsInvalid({
         ...isInvalid,
         [name]: !valid,
      });
   };

   const rawHTML = `
    <p>
      Please confirm your attendance, <strong>YES</strong> (joyfully accept), NO (regretfully decline)
    </p>
    `;

   return (
      <div className={`max-w-md ${robotoFont.className}`}>
         <Image
            src={'/assets/images/foto-wedding.jpg'}
            alt="wedding"
            width={500}
            height={500}
            priority={true}
            className="w-full h-64 object-cover mb-3"
         />
         <div className={`bg-[#E2DCD0] mx-3 mt-3 px-4 py-5 rounded-md`}>
            {isAnswer ? (
               <>
                  <h1 className="text-center flex flex-col gap-1">
                     <span>{firstLine} of </span>
                     <span className="text-lg font-semibold">{secondLine.join(' of ')}</span>
                  </h1>
                  <div className="border-b-2 border-slate-900 w-1/2 mx-auto mt-3 mb-10"></div>
                  <h5 className="text-md mb-7">
                     Dear, {''}
                     <span className="font-semibold">{invitations?.data?.clientName}</span>
                  </h5>

                  <form onSubmit={submitAnswer}>
                     {invitations?.data?.questions?.map((question: any, index: number) => (
                        <div className="flex flex-col mb-5" key={question.id}>
                           <label
                              htmlFor=""
                              className="mb-1"
                              dangerouslySetInnerHTML={{
                                 __html: question.question,
                              }}
                           ></label>
                           {question.type === 'radio' ? (
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-2">
                                    <input
                                       className="radio radio-sm checked:bg-[#1C1C1C] border-[#1C1C1C]"
                                       type={question.type}
                                       name={`question_${question.id}`}
                                       id={`question_yes_${question.id}`}
                                       value={`yes`}
                                       onChange={handleChangeRadio}
                                    />
                                    <label htmlFor={`question_yes_${question.id}`}>Yes</label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <input
                                       className="radio radio-sm checked:bg-[#1C1C1C] border-[#1C1C1C]"
                                       type={question.type}
                                       name={`question_${question.id}`}
                                       id={`question_no_${question.id}`}
                                       value={`no`}
                                       onChange={handleChangeRadio}
                                    />
                                    <label htmlFor={`question_no_${question.id}`}>No</label>
                                 </div>
                              </div>
                           ) : (
                              <input
                                 type="text" // Menggunakan text untuk mencegah perilaku input number HTML default
                                 className={`rounded-md px-3 py-2 ${
                                    isInvalid[`question_${question.id}`] ? 'border-red-500 border' : ''
                                 }`}
                                 name={`question_${question.id}`}
                                 disabled={disabled}
                                 onChange={handleChangeInput(question.type)}
                                 value={formValues[`question_${question.id}`] || ''}
                                 inputMode={question.type === 'number' ? 'numeric' : undefined}
                                 pattern={question.type === 'number' ? '\\d*' : undefined}
                              />
                           )}
                        </div>
                     ))}
                     <button
                        className="bg-[#1C1C1C] text-slate-100 w-full px-4 py-2 rounded-md mt-4 mb-2"
                        disabled={status === 'loading'}
                     >
                        {status === 'loading' ? <div className="loader"></div> : 'Submit'}
                     </button>
                     <div className="flex flex-col items-center justify-center gap-2 my-6">
                        <h1 className="text-xs">Powered by</h1>
                        <Image
                           src={'/assets/images/convito-logo.png'}
                           width={500}
                           height={500}
                           alt="powered by convito"
                           className="w-28"
                           priority={true}
                        />
                     </div>
                  </form>
               </>
            ) : (
               <div className="h-1/2 pt-5 pb-10 text-center">
                  <h1 className="text-md font-semibold">
                     <Image
                        src={'/assets/images/checkmark.png'}
                        width={500}
                        height={500}
                        alt="checkmark"
                        className="w-24 inline-block mb-3"
                     />
                  </h1>
                  <h1 className="text-[1.4rem] font-semibold mb-3">Thank You for Your RSVP!</h1>
                  <p className="text-[13px]">Thank you for confirming your attendance.</p>
                  <p className="text-[13px] mb-44">We have successfully received your RSVP</p>
                  <div className="flex flex-col items-center justify-center gap-2">
                     <h1 className="text-xs">Powered by</h1>
                     <Image
                        src={'/assets/images/convito-logo.png'}
                        width={500}
                        height={500}
                        alt="powered by convito"
                        className="w-28"
                        priority={true}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
