import { useState } from 'react';
import { AddScenario } from '../form/addScenario';

type ScenarioTabProps = {
   clientId?: string;
};

export const ScenarioTab = ({ clientId }: ScenarioTabProps) => {
   console.log(clientId);
   const [isAddScenario, setIsAddScenario] = useState(false);
   return (
      <div>
         <button
            className={`btn ${isAddScenario ? 'bg-slate-900 hover:bg-slate-950 text-white' : ' bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600'} transition duration-100 ease-in text-[14px] font-semibold mb-4`}
            onClick={() => setIsAddScenario(!isAddScenario)}
         >
            {isAddScenario ? 'Back' : 'Add scenario'}
         </button>
         {isAddScenario ? (
            <AddScenario clientId={clientId} />
         ) : (
            <div className="flex items-center justify-between mb-3">
               <h2 className="text-lg font-bold mb-2">Scenario data</h2>
               <input type="text" placeholder="Search" className="border-[1px] px-3 py-1 rounded-md" />
            </div>
         )}
      </div>
   );
};
