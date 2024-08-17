import { useState } from 'react';
import { DashboardTab } from './DashboardTab';
import { PresentationChartLine } from '../icons/presentationChardLine';
import { Photo } from '../icons/photo';
import { Question } from '../icons/question';
import { GalleryTab } from './GalleryTab';
import { QuestionTab } from './QuestionTab';
import { Data } from '../icons/data';
import { DataTab } from './DataTab';
import { ChatBubleLeftRight } from '../icons/chatBubleLeftRight';
import { BroadcastTemplateTab } from './BroadcastTemplateTab';
import { ScenarioTab } from './ScenarioTab';
import { DocumentText } from '../icons/documentText';

interface TabProps {
   clientId?: string;
}

export const Tab = ({ clientId }: TabProps) => {
   const tabs = [
      {
         name: 'Dashboard',
         icon: <PresentationChartLine />,
         content: <DashboardTab />,
         disabled: false,
      },
      {
         name: 'Gallery',
         icon: <Photo />,
         content: <GalleryTab clientId={clientId} />,
         disabled: false,
      },
      {
         name: 'Data',
         icon: <Data />,
         content: <DataTab clientId={clientId} />,
         disabled: false,
      },
      {
         name: 'Questions',
         icon: <Question />,
         content: <QuestionTab />,
         disabled: false,
      },
      {
         name: 'Broadcast Template',
         icon: <ChatBubleLeftRight />,
         content: <BroadcastTemplateTab />,
         disabled: false,
      },
      {
         name: 'Scenario',
         icon: <DocumentText />,
         content: <ScenarioTab />,
         disabled: false,
      },
   ];

   const [activeTab, setActiveTab] = useState(tabs[0].name);

   const handleTabClick = (tabName: any, isDisabled: any) => {
      if (!isDisabled) {
         setActiveTab(tabName);
      }
   };

   return (
      <>
         <div className="border-b-[1px] border-gray-200 dark:border-gray-900">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-900 dark:text-gray-900">
               {tabs.map((tab) => (
                  <li key={tab.name} className="me-5">
                     <button
                        onClick={() => handleTabClick(tab.name, tab.disabled)}
                        className={`inline-flex items-center justify-center p-4 border-b-[1px] rounded-t-lg group transition-all duration-100 ease-in
                  ${
                     tab.disabled
                        ? 'text-gray-400 cursor-not-allowed dark:text-gray-900 border-transparent'
                        : activeTab === tab.name
                          ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                          : 'border-transparent hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-500'
                  }
                `}
                        disabled={tab.disabled}
                        aria-current={activeTab === tab.name ? 'page' : undefined}
                     >
                        {tab.icon && (
                           <span
                              className={` ${
                                 activeTab === tab.name
                                    ? 'text-blue-600 dark:text-blue-500'
                                    : 'text-gray-400 group-hover:text-blue-500 dark:text-slate-900 dark:group-hover:text-blue-500'
                              }`}
                           >
                              {tab.icon}
                           </span>
                        )}
                        {tab.name}
                     </button>
                  </li>
               ))}
            </ul>
         </div>
         <div className="p-4">
            <div className="card bg-slate-50 text-slate-900 w-full shadow-md">
               <div className="card-body">
                  {tabs.map(
                     (tab) =>
                        activeTab === tab.name && (
                           <div key={tab.name} className="animate-fade-in">
                              {tab.content}
                           </div>
                        )
                  )}
               </div>
            </div>
         </div>
      </>
   );
};
