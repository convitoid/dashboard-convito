import moment from "moment";
import * as XLSX from 'xlsx';

interface Question {
   question: string;
   answer: string | null;
}

interface GuestData {
   id: number;
   guestId: string;
   name: string;
   scenario: string;
   phone_number: string;
   pax: string;
   kids_pax: string;
   holmat_pax: string;
   welcome_dinner_pax: string;
   hotel: string;
   scenario_slug: string;
   questions: Question[];
}

type DynamicRowData = {
   [key: string]: any;
};

export const exportToExcel = (data: any, clientId?: any) => {
   // Prepare data for Excel export
   const exportData = data.map((item: any, index: number) => {
      // Base data
      const rowData: DynamicRowData = {
         no: index + 1,
         guestId: item.guestId,
         name: item.name,
         scenario: item.scenario,
         phone_number: `+${item.phone_number}`,
         pax: item.pax,
         kids_pax: item.kids_pax,
         holmat_pax: item.holmat_pax,
         welcome_dinner_pax: item.welcome_dinner_pax,
         hotel: item.hotel,
      };

      // Add each question and answer to its own column
      item.questions.forEach((q: any, index: number) => {
         // get index 0
         const questionNumber = index + 1;
         rowData[`question_${questionNumber}`] = q.question.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
         rowData[`answer_${questionNumber}`] = q.answer || 'N/A';
         // rowData[`answer_at_${questionNumber}`] = q.answer_at || 'N/A';
         // rowData['answer_at'] = moment(q.answer_at).format('DD/MM/YYYY HH:mm:ss') || 'N/A';
         rowData['answer_at'] = item.questions[0]?.answer_at ? moment(item.questions[0]?.answer_at).format('DD/MM/YYYY HH:mm:ss') : 'N/A';
      });

      return rowData;
   });



   // Create a worksheet from the data
   const worksheet = XLSX.utils.json_to_sheet(exportData);

   // Create a new workbook and append the worksheet
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');

   const generateName = () => {
      const date = moment().format('YYYY-MM-DD');
      return `Convito_${clientId}_guests_${date}.xlsx`;
   };

   // Generate Excel file and download it
   XLSX.writeFile(workbook, `${generateName()}`, { bookType: 'xlsx', type: 'buffer' });
};
