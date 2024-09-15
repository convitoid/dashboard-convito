import { useDispatch, useSelector } from 'react-redux';
import { ModalComponent } from '../modal';
import { AppDispatch, RootState } from '@/app/store';
import { use, useEffect, useState } from 'react';
import { getAllQuestions, getQuestionById, updateQuestion } from '@/app/GlobalRedux/Thunk/questions/questionThunk';
import {
   closeModalEditQuestionAction,
   openModalEditQuestionAction,
} from '@/app/GlobalRedux/Features/question/questionSlice';
import { EditorProvider, Editor, Toolbar, BtnBold, BtnItalic, BtnUnderline } from 'react-simple-wysiwyg';
import Swal from 'sweetalert2';

type ModalEditQuestionProps = {
   modalId: string;
   clientId: string;
   questionId: string;
};

export const ModalEditQuestion = ({ modalId, clientId, questionId }: ModalEditQuestionProps) => {
   const [formData, setFormData] = useState({
      question: '',
      type: '',
      id: '',
   });
   const dispatch = useDispatch<AppDispatch>();
   const question = useSelector((state: RootState) => state.questions.questionById);
   const statusUpdate = useSelector((state: RootState) => state.questions.statusUpdate);

   useEffect(() => {
      setFormData({ ...formData, question: question?.question, type: question?.type, id: question?.id });
   }, [question]);

   const closeModalEditQuestion = () => {
      dispatch(closeModalEditQuestionAction());
      (document.getElementById(`${modalId}`) as HTMLDialogElement).close();
   };

   const handleChangeQuestion = (e: any) => {
      setFormData({ ...formData, question: e.target.value });
   };

   const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData({ ...formData, type: e.target.value });
   };

   const submitUpdateQuestion = (e: any) => {
      e.preventDefault();
      if (formData.question === '' || formData.type === '') {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill all fields!',
            target: document.getElementById(`${modalId}`),
         });
      }

      dispatch(updateQuestion({ clientId, formData }))
         .unwrap()
         .then((res) => {
            if (res.status === 201) {
               Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Question updated successfully',
                  target: document.getElementById(`${modalId}`),
               }).then(() => {
                  closeModalEditQuestion();
                  dispatch(getAllQuestions(clientId?.toString() ?? ''));
               });
            }
         });
   };

   return (
      <ModalComponent
         modalId={modalId}
         modalHeader="Edit Question"
         modalWrapper="p-0 w-full max-w-2xl"
         backgroundColorHeader="bg-blue-500 px-6 py-5 text-white"
         modalBodyStyle="pt-3 px-6 pb-6"
         closeModal={closeModalEditQuestion}
      >
         <form onSubmit={submitUpdateQuestion}>
            <div className="flex flex-col gap-2 mb-5">
               <label htmlFor="question" className="text-[16px] font-semibold">
                  Question
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
                  Choose Type
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
                  onClick={closeModalEditQuestion}
                  disabled={statusUpdate === 'loading'}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="btn bg-blue-500 text-white hover:bg-blue-600 mt-5"
                  disabled={statusUpdate === 'loading'}
               >
                  {statusUpdate === 'loading' ? <span className="loading loading-spinner loading-xs"></span> : 'Submit'}
               </button>
            </div>
         </form>
      </ModalComponent>
   );
};
