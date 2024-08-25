'use client';

import { fetchInvitation } from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import { getInvitation } from '@/app/GlobalRedux/Thunk/invitation/invitationThunk';
import NotFound from '@/app/not-found';
import { AppDispatch, RootState } from '@/app/store';
import { InvitationHome } from '@/components/page/invitationHome';
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Mustache from 'mustache';

const robotoFont = Roboto({
   weight: ['100', '300', '400', '500', '700', '900'],
   display: 'swap',
   subsets: ['latin'],
});

export default function InvitationPage({ params }: { params: { token: string } }) {
   const [isInvalid, setIsInvalid] = useState<any>({});
   const [disabled, setDisabled] = useState<boolean>(true);
   const [formValues, setFormValues] = useState<any>({});
   const [guestDetail, setGuestDetail] = useState<any>([]);
   const [guestDetailFormated, setGuestDetailFormated] = useState<any>([]);
   const router = useRouter();

   const token = params.token;
   const dispatch = useDispatch<AppDispatch>();
   const invitations = useSelector((state: RootState) => state.invitations.invitations);
   const status = useSelector((state: RootState) => state.invitations.status);

   useEffect(() => {
      dispatch(getInvitation(token[0]));
   }, [dispatch, token]);

   useEffect(() => {
      setGuestDetail(invitations?.data?.GuestDetail);
      const newGuestDetail = guestDetail?.reduce((acc: any, item: any) => {
         //  acc[item.detail_key] = item.detail_val;
         // set to lowercase
         acc[item.detail_key.toUpperCase()] = item.detail_val;
         return acc;
      }, {});

      setGuestDetailFormated(newGuestDetail);
   }, [invitations, dispatch]);

   const dynamicQuestion = (question: any) => {
      if (guestDetailFormated) {
         question = Mustache.render(question, guestDetailFormated);
      }
      return question;
   };

   useEffect(() => {
      document.title = 'Convito - Reservations wedding and event';
   }, []);

   return (
      <div className="relative z-10">
         <div className="flex justify-center mb-3">
            {status === 'loading' ? (
               <div className="flex flex-col justify-center items-center h-screen">
                  <div className="loader"></div>
               </div>
            ) : (
               <div className={`max-w-md ${robotoFont.className}`}>
                  {invitations?.data?.client?.image?.length > 0 &&
                     invitations?.data?.client?.image?.map((img: any) => (
                        <Image
                           key={img.id}
                           src={img.imagePath}
                           alt={img.imageName}
                           width={500}
                           height={500}
                           priority={true}
                           className="w-full h-64 object-cover mb-3"
                        />
                     ))}
                  <div className={`bg-[#E2DCD0] mx-3 mt-3 px-4 py-5 rounded-md`}>
                     <h1 className="text-center flex flex-col gap-1">
                        <span>The Wedding of</span>
                        <span className="text-lg font-semibold">{invitations?.data?.client?.event_name}</span>
                     </h1>
                     <div className="border-b-2 border-slate-900 w-1/2 mx-auto mt-3 mb-10"></div>
                     <h5 className="text-md mb-7">
                        Dear, {''}
                        <span className="font-semibold">{invitations?.data?.name}</span>
                     </h5>

                     <form action="">
                        {invitations?.data?.client?.Scenario[0].ScenarioQuestion?.map((question: any, index: any) => (
                           <div className="flex flex-col mb-5" key={question.id}>
                              <label
                                 htmlFor=""
                                 className="mb-3"
                                 dangerouslySetInnerHTML={{
                                    __html: dynamicQuestion(question?.Question?.question),
                                 }}
                              ></label>
                              {question?.Question?.type === 'radio' ? (
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                       <input
                                          className="radio radio-sm checked:bg-[#1C1C1C] border-[#1C1C1C]"
                                          type={question?.Question?.type}
                                          name={`question_${question?.Question?.id}`}
                                          id={`question_yes_${question?.Question?.id}`}
                                          value={`yes`}
                                          //   onChange={handleChangeRadio}
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
                                          //   onChange={handleChangeRadio}
                                       />
                                       <label htmlFor={`question_no_${question.Question?.id}`}>No</label>
                                    </div>
                                    {/* <pre>{JSON.stringify(question.Question.id, null, 2)}</pre> */}
                                 </div>
                              ) : (
                                 <input
                                    type="text" // Menggunakan text untuk mencegah perilaku input number HTML default
                                    className={`rounded-md px-3 py-2 ${
                                       isInvalid[`question_${question?.Question.id}`] ? 'border-red-500 border' : ''
                                    }`}
                                    name={`question_${question.id}`}
                                    // disabled={disabled}
                                    // onChange={handleChangeInput(question.type)}
                                    // value={formValues[`question_${question.Question.id}`] || ''}
                                    inputMode={question.type === 'number' ? 'numeric' : undefined}
                                    pattern={question.type === 'number' ? '\\d*' : undefined}
                                 />
                              )}
                           </div>
                        ))}
                        <button
                           className="bg-[#1C1C1C] text-slate-100 w-full px-4 py-2 rounded-md mt-4 mb-2"
                           //    disabled={status === 'loading'}
                        >
                           {/* {status === 'loading' ? <div className="loader"></div> : 'Submit'} */}
                           Submit
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
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
