'use client';

import { fetchInvitation } from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import { getAnswer, getInvitation, updateAnswer } from '@/app/GlobalRedux/Thunk/invitation/invitationThunk';
import NotFound from '@/app/not-found';
import { AppDispatch, RootState } from '@/app/store';
import { InvitationHome } from '@/components/page/invitationHome';
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Mustache from 'mustache';
import Swal from 'sweetalert2';
import { resetStatus } from '@/app/GlobalRedux/Features/invitation/invitationSlice';
import jwt from 'jsonwebtoken';
import { decode } from 'punycode';
import './style.css';

const robotoFont = Roboto({
   weight: ['100', '300', '400', '500', '700', '900'],
   display: 'swap',
   subsets: ['latin'],
});

export default function InvitationPage({ params }: { params: { token: string } }) {
   const token = params.token;
   const dispatch = useDispatch<AppDispatch>();
   const invitations = useSelector((state: RootState) => state.invitations.invitations);
   const status = useSelector((state: RootState) => state.invitations.status);
   const answer = useSelector((state: RootState) => state.invitations.invitation);

   const [guestDetail, setGuestDetail] = useState([]);
   const [guestDetailFormated, setGuestDetailFormated] = useState<{ [key: string]: any }>({});
   const [isAnswer, setIsAnswer] = useState<boolean>(false);
   const [disabled, setDisabled] = useState<boolean>(true);
   const [formValues, setFormValues] = useState<any>({});
   const [isInvalid, setIsInvalid] = useState<any>({});
   const [answerData, setAnswerData] = useState<any>([]);
   const [guestId, setGuestId] = useState('');
   const [validateQuestion, setValidateQuestion] = useState<{ [key: string]: any }>({});
   const router = useRouter();

   const decodeToken = jwt.decode(token[0]);

   useEffect(() => {
      dispatch(getInvitation(token[0]))
         .unwrap()
         .then((res) => {
            if (res.status === 404) {
               return router.push('/404');
            }
            setGuestDetail(res.data.GuestDetail);
            setFormValues({
               ...formValues,
               id: res.data.id,
            });
            setGuestId(res.data.id);
         });
      dispatch(resetStatus());
   }, [dispatch, token]);

   useEffect(() => {
      const newGuestDetail = guestDetail?.reduce((acc: any, item: any) => {
         acc[item.detail_key.toUpperCase()] = item.detail_val;
         return acc;
      }, {});

      setGuestDetailFormated(newGuestDetail);
   }, [guestDetail]);

   useEffect(() => {
      if (invitations) {
         dispatch(getAnswer({ data: decodeToken }));
      }
   }, [dispatch, invitations]);

   useEffect(() => {
      if (answer) {
         setAnswerData(answer);
      }

      if (answerData.length > 0) {
         const isAnswer = answerData.filter((data: any) => data.answer !== null);

         if (isAnswer.length > 0) {
            setIsAnswer(true);
         }
      }
   }, [answer]);

   function dynamicQuestion(question: any) {
      if (guestDetailFormated !== undefined) {
         question = Mustache.render(question, guestDetailFormated);
      }
      return Mustache.render(question, guestDetailFormated);

      return question;
   }

   const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (value === 'no') {
         setDisabled(true);
      }

      if (value === 'yes') {
         setDisabled(false);
      }

      setFormValues({
         ...formValues,
         [name]: value,
      });
   };

   const handleChangeInput = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const name = event.target.name;
      let valid = true;
      // get data-question
      const questionDataInput = event.target.getAttribute('data-question');

      const extractBracketContent = (str: any) => {
         const regex = /{{(.*?)}}/g;
         let match;
         const results = [];

         // Menemukan semua kecocokan dan menambahkannya ke array hasil
         while ((match = regex.exec(str)) !== null) {
            results.push(match[1].trim());
         }

         return results;
      };

      const test = extractBracketContent(questionDataInput);

      // cari value dari key yang ada di guestDetailFormated
      const findValue = Object.keys(guestDetailFormated).filter((key) => key === test[0]);

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

         if (parseInt(trimmedValue) > parseInt(guestDetailFormated[test[0]])) {
            valid = false;
         }

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

   const submitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const dataForm = Object.fromEntries(formData.entries());
      const getIdKey = Object.keys(dataForm).filter((key) => key.includes('question_'));
      const getId = getIdKey.map((key) => key.split('_')[1]);

      const isNo = getId.some((id) => dataForm[`question_${id}`] === 'no');

      const invalidValue = Object.values(isInvalid).some((value) => value === true);

      if (invalidValue) {
         return Swal.fire({
            icon: 'warning',
            title: 'Failed',
            text: 'Please fill in the field correctly',
         });
      }

      if (isNo) {
         const newData = getId.map((id) => {
            return {
               questionId: id,
               answer: dataForm[`question_${id}`],
            };
         });

         dispatch(updateAnswer({ guestId: guestId, data: newData }))
            .unwrap()
            .then((res) => {
               dispatch(getInvitation(token[0]));
               dispatch(getAnswer({ data: decodeToken }));
            });
      } else {
         const missingFields = getId.filter((id) => dataForm[`question_${id}`]);
         // #1C1C1C
         if (missingFields.length !== invitations?.client?.Scenario[0]?.ScenarioQuestion?.length) {
            return Swal.fire({
               icon: 'warning',
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

         dispatch(updateAnswer({ guestId: guestId, data: newData }))
            .unwrap()
            .then((res) => {
               dispatch(getInvitation(token[0]));
               dispatch(getAnswer({ data: decodeToken }));
            });
      }
   };

   useEffect(() => {
      document.title = 'Convito - Reservations wedding and event';
   }, []);

   return (
      <div className="relative z-10">
         <div className="flex justify-center mb-3">
            {status === 'loading' || status === 'idle' ? (
               <div className="flex flex-col justify-center items-center h-screen">
                  <div className="loader"></div>
               </div>
            ) : (
               <div className={`max-w-md ${robotoFont.className}`}>
                  {invitations?.client?.image?.length > 0 &&
                     invitations?.client?.image?.map((img: any) => (
                        <Image
                           key={img.id}
                           src={invitations.imageUrl[0]}
                           alt={img.imageName}
                           width={500}
                           height={500}
                           priority={true}
                           className="w-full h-64 object-cover mb-3"
                           unoptimized
                        />
                     ))}
                  <div className={`bg-[#E2DCD0] mx-3 mt-3 px-4 py-5 rounded-md`}>
                     {isAnswer ? (
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
                     ) : (
                        <>
                           <h1 className="text-center flex flex-col gap-1">
                              <span>{invitations?.client?.event_title}</span>
                              <span className="text-lg font-semibold">{invitations?.client?.event_name}</span>
                           </h1>
                           <div className="border-b-2 border-slate-900 w-1/2 mx-auto mt-3 mb-10"></div>
                           <h5 className="text-md mb-7">
                              Dear, {''}
                              <span className="font-semibold">{invitations?.name}</span>
                           </h5>

                           <form onSubmit={submitAnswer}>
                              {invitations?.client?.Scenario[0].ScenarioQuestion?.map((question: any, index: any) => (
                                 <div className="flex flex-col mb-3" key={question.id}>
                                    {question?.Question?.question && (
                                       <label
                                          htmlFor=""
                                          className="mb-3"
                                          dangerouslySetInnerHTML={{
                                             // __html: question.Question.question,
                                             __html: Mustache.render(question.Question.question, guestDetailFormated),
                                          }}
                                       ></label>
                                    )}
                                    {question?.Question?.type === 'radio' ? (
                                       <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-2">
                                             <input
                                                className="radio radio-sm checked:bg-[#1C1C1C] border-[#1C1C1C]"
                                                type={question?.Question?.type}
                                                name={`question_${question?.Question?.id}`}
                                                id={`question_yes_${question?.Question?.id}`}
                                                value={`yes`}
                                                onChange={handleChangeRadio}
                                             />
                                             <label htmlFor={`question_yes_${question?.Question?.id}`}>Yes</label>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <input
                                                className="radio radio-sm checked:bg-[#1C1C1C] border-[#1C1C1C]"
                                                type={question.Question.type}
                                                name={`question_${question?.Question?.id}`}
                                                id={`question_no_${question?.Question?.id}`}
                                                value={`no`}
                                                onChange={handleChangeRadio}
                                             />
                                             <label htmlFor={`question_no_${question.Question?.id}`}>No</label>
                                          </div>
                                       </div>
                                    ) : (
                                       <>
                                          <input
                                             type={question.Question.type}
                                             className={`rounded-md px-3 py-2 ${
                                                isInvalid[`question_${question?.Question.id}`]
                                                   ? 'border-red-500 border'
                                                   : ''
                                             }`}
                                             name={`question_${question.Question.id}`}
                                             disabled={disabled}
                                             onChange={handleChangeInput(question?.Question?.type)}
                                             value={formValues[`question_${question.Question.id}`] || ''}
                                             inputMode={question.Question.type === 'number' ? 'numeric' : undefined}
                                             pattern={question.Question.type === 'number' ? '\\d*' : undefined}
                                             data-question={question.Question.question}
                                          />
                                          {isInvalid[`question_${question?.Question.id}`] && (
                                             <span className="text-[12px] mt-1 ml-1 text-red-500">
                                                Input is Invalid.
                                             </span>
                                          )}
                                       </>
                                    )}
                                 </div>
                              ))}
                              <button
                                 className="bg-[#1C1C1C] text-slate-100 w-full px-4 py-2 rounded-md mt-4 mb-2"
                                 disabled={status === 'updateAnswerLoading'}
                              >
                                 {status === 'updateAnswerLoading' ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                 ) : (
                                    'Submit'
                                 )}
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
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
