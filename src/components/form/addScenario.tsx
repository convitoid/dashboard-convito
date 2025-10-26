import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { getAllQuestions } from '@/app/GlobalRedux/Thunk/questions/questionThunk';
import { getAllBroadcastTemplates } from '@/app/GlobalRedux/Thunk/broadcastTemplate/broadcastTemplateThunk';
import Swal from 'sweetalert2';
import {
   createScenario,
   getAllScenario,
   getScenarioById,
   updateScenario,
} from '@/app/GlobalRedux/Thunk/scenario/scenarioThunk';
import { resetData, resetStatus } from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';
import { setIsAddScenario } from '@/app/GlobalRedux/Features/scenario/scenarioSlice';

interface Question {
   id: string;
   name: string;
   status: boolean;
}

interface BroadcastTemplate {
   id: string;
   name: string;
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
   const formStatus = useSelector((state: RootState) => state.scenario.formStatus);
   const scenarioId = useSelector((state: RootState) => state.scenario.scenarioId);
   const scenarioDetail = useSelector((state: RootState) => state.scenario.data);
   const statusScenario = useSelector((state: RootState) => state.scenario.status);

   useEffect(() => {
      if (clientId) {
         dispatch(getAllQuestions(clientId));
         dispatch(getAllBroadcastTemplates(clientId));
      }
   }, [dispatch, clientId]);

   useEffect(() => {
      if (formStatus === 'edit') {
         dispatch(getScenarioById({ clientId: clientId ?? '', scenarioId: scenarioId ?? '' }));
      }
   }, [dispatch, clientId]);

   useEffect(() => {
      if (formStatus === 'edit' && scenarioDetail) {
         setFormData({
            scenario_name: scenarioDetail.scenario_name,
            broadcast_template: [],
            question: [],
         });

         if (statusScenario === 'success') {
            dispatch(resetStatus());
            setSelectedQuestions(
               scenarioDetail?.ScenarioQuestion?.map((question: any) => ({
                  id: question.question_id,
                  name: question.scenario_question,
                  status: true,
               }))
            );

            setSelectedBroadcastTemplate(
               scenarioDetail?.ScenarioBroadcastTemplate?.map((broadcastTemplate: any) => ({
                  id: broadcastTemplate.broadcast_template_id,
                  name: broadcastTemplate.broadcast_template_scenario,
                  status: true,
               }))
            );
         }
      }
   }, [scenarioDetail, formStatus]);

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

         return;
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

         return;
      }

      if (formData.scenario_name.length === 0) {
         Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please input scenario name',
         });

         return;
      }

      if (formStatus === 'edit') {
         const data = {
            id: scenarioId,
            scenario_name: formData.scenario_name,
            question: formData.question.filter((item: any) => item.status === true),
            broadcast_template: formData.broadcast_template.filter((item: any) => item.status === true),
            clientId: Array.isArray(clientId) ? clientId[0] : clientId,
         };
         dispatch(updateScenario({ clientId: clientId ?? '', data: data }))
            .unwrap()
            .then((res) => {
               if (res.status === 201) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Scenario updated successfully',
                  }).then(() => {
                     dispatch(setIsAddScenario(false));
                     dispatch(resetStatus());
                     dispatch(resetData());
                     dispatch(getAllScenario(clientId ?? ''));
                  });
               }
            });
      } else {
         const data = {
            clientId: Array.isArray(clientId) ? clientId[0] : clientId,
            scenario_name: formData.scenario_name,
            question: formData.question.filter((item: any) => item.status === true),
            broadcast_template: formData.broadcast_template.filter((item: any) => item.status === true),
         };

         dispatch(createScenario({ clientId: clientId ?? '', data: data }))
            .unwrap()
            .then((res) => {
               if (res.message.code === 'P2002') {
                  Swal.fire({
                     icon: 'warning',
                     title: 'Oops...',
                     text: 'Name scenario already exist, please use another name',
                  });
               }

               if (res.status === 201) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Success',
                     text: 'Scenario created successfully',
                  }).then(() => {
                     dispatch(setIsAddScenario(false));
                     dispatch(resetStatus());
                     dispatch(resetData());
                     dispatch(getAllScenario(clientId ?? ''));
                  });
               }
            });
      }
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
               <div className="flex justify-between items-start">
                  <div className="flex-1">
                     <h1 className="text-[16px] font-semibold mb-6">Question</h1>
                     <div className="space-y-5">
                        {loading === 'loading'
                           ? 'Loading...'
                           : questions.length > 0
                             ? questions.map((question: any) => (
                                  <div key={question.id} className="flex items-center justify-between">
                                     <label htmlFor={`question${question.id}`} className="flex-1 cursor-pointer">
                                        <div dangerouslySetInnerHTML={{ __html: question.question }}></div>
                                     </label>
                                     <input
                                        type="checkbox"
                                        name={`q${question.position}`}
                                        id={`question${question.id}`}
                                        className="checkbox checkbox-accent ml-4"
                                        checked={selectedQuestions?.some((q) => q.id === question.id && q.status)}
                                        onChange={(e) => handleCheckboxChange(e, question.id, 'question')}
                                     />
                                  </div>
                               ))
                             : 'No data available'}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="card bg-base-100 shadow-md mb-3">
            <div className="card-body p-7">
               <div className="flex justify-between items-start">
                  <div className="flex-1">
                     <h1 className="text-[16px] font-semibold mb-6">Broadcast Template</h1>
                     <div className="space-y-5">
                        {broadcastLoading === 'loading'
                           ? 'Loading...'
                           : broadcastTemplates.length > 0
                             ? broadcastTemplates.map((broadcastTemplate: any) => (
                                  <div key={broadcastTemplate.id} className="flex items-center justify-between">
                                     <label htmlFor={`broadcast${broadcastTemplate.id}`} className="flex-1 cursor-pointer">
                                        {broadcastTemplate.template_name}
                                     </label>
                                     <input
                                        type="checkbox"
                                        name={`${broadcastTemplate.template_name}`}
                                        id={`broadcast${broadcastTemplate.id}`}
                                        className="checkbox checkbox-accent ml-4"
                                        checked={selectedBroadcastTemplate?.some(
                                           (bt) => bt.id === broadcastTemplate.id && bt.status
                                        )}
                                        onChange={(e) => handleCheckboxChange(e, broadcastTemplate.id, 'broadcast_template')}
                                     />
                                  </div>
                               ))
                             : 'No data available'}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 justify-end">
            <button
               className={`bg-blue-500 text-white px-5 py-3 hover:bg-blue-600 transition duration-100 ease-in rounded-md ${statusScenario === 'loading' ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed' : ''}`}
               disabled={statusScenario === 'loading'}
            >
               {statusScenario === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Submit'}
            </button>
         </div>
      </form>
   );
};
