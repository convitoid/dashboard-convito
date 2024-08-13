export const createClientValidation = (values: any) => {
   let errors: any = {};

   for (const key in values) {
      if (values[key] === '') {
         errors[key] = `${key} is required`;
      }
   }

   return errors;
};
