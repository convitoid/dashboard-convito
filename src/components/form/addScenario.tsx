import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { getAllQuestions } from '@/app/GlobalRedux/Thunk/questions/questionThunk';
import { getAllBroadcastTemplates } from '@/app/GlobalRedux/Thunk/broadcastTemplate/broadcastTemplateThunk';
import Swal from 'sweetalert2';

interface Question {
   id: string;
   name: string;
   status: boolean;
}

interface BroadcastTemplate {
   id: string;
   template_name: string;
   status: boolean;
}

interface FormData {
   scenario_name: string;
   question: any[];
   broadcast_template: any[];
}

type AddScenarioProps = {
   clientId?: string;
};

export const AddScenario = ({ clientId }: AddScenarioProps) => {
   const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
   const [selectedBroadcastTemplate, setSelectedBroadcastTemplate] = useState<BroadcastTemplate[]>([]);
   const [formData, setFormData] = useState<FormData>({
      scenario_name: '',
      question: [],
      broadcast_template: [],
   });

   const dispatch = useDispatch<AppDispatch>();
   const questions = useSelector((state: RootState) => state.questions.questions);
   const broadcastTemplates = useSelector((state: RootState) => state.broadcastTemplate.datas);
   const loading = useSelector((state: RootState) => state.questions.status);
   const broadcastLoading = useSelector((state: RootState) => state.broadcastTemplate.status);

   useEffect(() => {
      if (clientId) {
         dispatch(getAllQuestions(clientId));
         dispatch(getAllBroadcastTemplates(clientId));
      }
   }, [dispatch, clientId]);

   const handleCheckboxChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      id: string,
      scenarioType: 'question' | 'broadcast_template'
   ) => {
      const { checked } = e.target;
      const setter = scenarioType === 'question' ? setSelectedQuestions : setSelectedBroadcastTemplate;

      setter((prev: any) => {
         const updatedItems = prev.map((item: any) => (item.id === id ? { ...item, status: checked } : item));

         if (!updatedItems.some((item: any) => item.id === id)) {
            updatedItems.push({ id, name: e.target.name, status: checked });
         }

         return updatedItems;
      });
   };

   const submitScenario = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      formData.question = selectedQuestions;
      formData.broadcast_template = selectedBroadcastTemplate;

      if (formData.question.length === 0 || formData.broadcast_template.length === 0) {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select question and broadcast template',
         });
      }

      if (
         formData.question.filter((item: any) => item.status === true).length === 0 ||
         formData.broadcast_template.filter((item: any) => item.status === true).length === 0
      ) {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select question and broadcast template',
         });
      }

      if (formData.scenario_name.length === 0) {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please input scenario name',
         });
      }

      console.log(formData);
   };

   return (
      <form onSubmit={submitScenario}>
         <div className="card bg-base-100 w-[40%] shadow-md mb-4">
            <div className="card-body p-7">
               <label className="text-[16px] font-semibold mb-3">Scenario Name</label>
               <input
                  type="text"
                  name="scenario_name"
                  id="scenario_name"
                  placeholder="Input scenario name here"
                  className="border-[1px] border-slate-400 py-3 px-4 rounded-md focus:outline-slate-500"
                  value={formData.scenario_name}
                  onChange={(e) => setFormData({ ...formData, scenario_name: e.target.value })}
                  autoFocus={true}
               />
            </div>
         </div>

         <div className="card bg-base-100 shadow-md mb-4">
            <div className="card-body p-7">
               <div className="grid grid-cols-4">
                  <div className="col-span-3">
                     <h1 className="text-[16px] font-semibold mb-3 pb-3">Question</h1>
                     <div className="flex flex-col gap-5">
                        {loading === 'loading'
                           ? 'Loading...'
                           : questions.length > 0
                             ? questions.map((question: any) => (
                                  <label htmlFor={`question${question.id}`} key={question.id}>
                                     <div dangerouslySetInnerHTML={{ __html: question.question }}></div>
                                  </label>
                               ))
                             : 'No data available'}
                     </div>
                  </div>
                  <div className="col-span-1 w-[20%] flex flex-col items-center">
                     <h1 className="text-[16px] font-semibold mb-3 pb-3">Active</h1>
                     <div className="flex flex-col gap-5">
                        {questions.map((question: Question) => (
                           <input
                              key={question.id}
                              type="checkbox"
                              name={`question${question.id}`}
                              id={`question${question.id}`}
                              className="checkbox checkbox-accent"
                              checked={selectedQuestions.some((q) => q.id === question.id && q.status)}
                              onChange={(e) => handleCheckboxChange(e, question.id, 'question')}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="card bg-base-100 shadow-md mb-3">
            <div className="card-body p-7">
               <div className="grid grid-cols-4">
                  <div className="col-span-3">
                     <h1 className="text-[16px] font-semibold mb-3 pb-3">Broadcast Template</h1>
                     <div className="flex flex-col gap-5">
                        {broadcastLoading === 'loading'
                           ? 'Loading...'
                           : broadcastTemplates.length > 0
                             ? broadcastTemplates.map((broadcastTemplate: BroadcastTemplate) => (
                                  <label htmlFor={`broadcast${broadcastTemplate.id}`} key={broadcastTemplate.id}>
                                     {broadcastTemplate.template_name}
                                  </label>
                               ))
                             : 'No data available'}
                     </div>
                  </div>
                  <div className="col-span-1 w-[20%] flex flex-col items-center">
                     <h1 className="text-[16px] font-semibold mb-3 pb-3">Active</h1>
                     <div className="flex flex-col gap-5">
                        {broadcastTemplates.map((broadcastTemplate: BroadcastTemplate) => (
                           <input
                              key={broadcastTemplate.id}
                              type="checkbox"
                              name={`broadcast${broadcastTemplate.id}`}
                              id={`broadcast${broadcastTemplate.id}`}
                              className="checkbox checkbox-accent"
                              checked={selectedBroadcastTemplate.some(
                                 (bt) => bt.id === broadcastTemplate.id && bt.status
                              )}
                              onChange={(e) => handleCheckboxChange(e, broadcastTemplate.id, 'broadcast_template')}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 justify-end">
            <button className="bg-white border-[1px] border-slate-900 px-5 py-3 rounded-md hover:bg-slate-900 hover:text-white transition duration-100 ease-in">
               Cancel
            </button>
            <button className="bg-blue-500 text-white px-5 py-3 hover:bg-blue-600 transition duration-100 ease-in rounded-md">
               Submit
            </button>
         </div>
      </form>
   );
};
