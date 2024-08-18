type BroadcastTemplateTabProps = {
   clientId?: string;
};

export const BroadcastTemplateTab = ({ clientId }: BroadcastTemplateTabProps) => {
   console.log('clientId', clientId);
   return (
      <div>
         <button className="btn bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 transition duration-100 ease-in text-[14px] font-semibold mb-4">
            Add Broadcast Template
         </button>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-2">Broadcast Template Data</h2>
            <input type="text" placeholder="Search" className="border-[1px] px-3 py-1 rounded-md" />
         </div>
         <p>
            Manage your contacts here. You can add new contacts, edit existing ones, and organize them into groups for
            easier access.
         </p>
      </div>
   );
};
