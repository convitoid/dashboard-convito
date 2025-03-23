import React, { useState } from 'react';
import { ModalComponent } from '../modal';
import { EditorProvider, Editor, Toolbar, BtnBold, BtnItalic, BtnUnderline } from 'react-simple-wysiwyg';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { addQuestion, getAllQuestions } from '@/app/GlobalRedux/Thunk/questions/questionThunk';

type ModalAddQuestionProps = {
   modalId?: string;
   clientId: string;
};

export const ModalAddQuestion = ({ modalId, clientId }: ModalAddQuestionProps) => {
   const [formData, setFormData] = useState({
      question: '',
      type: '',
   });

   const dispatch = useDispatch<AppDispatch>();
   const statusAdd = useSelector((state: RootState) => state.questions.statusAdd);

   const handleChangeQuestion = (e: any) => {
      setFormData({ ...formData, question: e.target.value });
   };

   const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData({ ...formData, type: e.target.value });
   };

   const handleSubmit = (e: any) => {
      e.preventDefault();


      if (formData.question === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please input question!',
            target: document.getElementById(`${modalId}`),
         });

         return;
      }

      if (formData.type === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please choose type!',
            target: document.getElementById(`${modalId}`),
         });

         return;
      }

      dispatch(addQuestion({ clientId, formData }))
         .unwrap()
         .then((res) => {
            if (res.status !== 201) {
               Swal.fire({
                  icon: 'warning',
                  title: 'Oops...',
                  text: res.message,
                  target: document.getElementById(`${modalId}`),
               });
            }

            Swal.fire({
               icon: 'success',
               title: 'Success',
               text: res.message,
               target: document.getElementById(`${modalId}`),
            }).then(() => {
               dispatch(getAllQuestions(clientId));
               closeModalAddQuestion();
            });
         });
   };

   const closeModalAddQuestion = () => {
      (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
      setFormData({ question: '', type: '' });
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Edit client"
         modalWrapper="p-0 w-full max-w-2xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModalAddQuestion}
      >
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-5">
               <label htmlFor="question" className="text-[16px] font-semibold">
                  Input question
               </label>
               <EditorProvider>
                  <Editor
                     value={formData.question}
                     onChange={handleChangeQuestion}
                     name="question"
                     id="question"
                     autoFocus={true}
                  >
                     <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                     </Toolbar>
                  </Editor>
               </EditorProvider>
            </div>

            <div className="flex flex-col gap-1">
               <label htmlFor="type" className="text-[16px] font-semibold">
                  Choose type
               </label>
               <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChangeType}
                  className="select select-sm select-bordered"
               >
                  <option value="" disabled>
                     Choose type
                  </option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="radio">Radio</option>
               </select>
            </div>
            <div className="flex items-center justify-end">
               <button
                  type="button"
                  className="btn btn-md btn-ghost border-[1px] border-slate-900 mt-5 mr-3"
                  onClick={closeModalAddQuestion}
                  disabled={statusAdd === 'loading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white hover:bg-blue-600 mt-5"
                  disabled={statusAdd === 'loading'}
               >
                  {statusAdd === 'loading' ? <span className="loading loading-spinner loading-xs"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
