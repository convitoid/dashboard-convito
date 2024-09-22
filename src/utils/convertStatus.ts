export const convertStatus = (status: string) => {
   switch (status) {
      case 'accepted':
         return 'API SUCCESS';

      case 'sent':
         return 'SENT';

      case 'delivered':
         return 'DELIVERED';

      case 'failed':
         return 'FAILED';

      case 'read':
         return 'READ';
      default:
         return 'NOT SENT YET';
   }
};
