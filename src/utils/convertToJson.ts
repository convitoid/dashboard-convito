import slugify from 'slugify';

export const convertToJson = async (header: string[], data: any[]): Promise<any[]> => {
   console.log('header', header);
   const rows: any[] = [];

   // Use map and Promise.all to handle asynchronous operations
   await Promise.all(
      data.map(async (row: any[]) => {
         const rowData: any = {};
         row.forEach((element: any, index: number) => {
            rowData[header[index]] = element;
         });

         if (rowData.SCENARIO) {
            rowData.SCENARIO_SLUG = slugify(rowData.SCENARIO, { lower: true, replacement: '-' });
         }

         rows.push(rowData);
      })
   );

   // Return the JSON data
   return rows;
};
