import prisma from '@/libs/prisma';

export async function getMonthlyCustomerData() {
   const startOfYear = new Date(new Date().getFullYear(), 0, 1);
   const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

   // Group by event_name only
   const customers = await prisma.client.groupBy({
      by: ['event_name'], // Only group by event_name
      _count: {
         id: true, // Count the number of clients per event
      },
      where: {
         createdAt: {
            gte: startOfYear, // Filter by date range (optional)
            lt: endOfYear,
         },
      },
      orderBy: {
         event_name: 'asc', // Order by event_name
      },
   });

   // Optional: If you need to track the count of customers per month
   const monthlyData = Array(12).fill(0);

   // Fetch all customers by month, depending on createdAt for each event
   const allCustomers = await prisma.client.findMany({
      where: {
         createdAt: {
            gte: startOfYear,
            lt: endOfYear,
         },
      },
      select: {
         createdAt: true,
      },
   });

   allCustomers.forEach((customer) => {
      const month = new Date(customer.createdAt).getMonth(); // Get month index (0 for Jan, 11 for Dec)
      monthlyData[month] += 1; // Increment the count for the respective month
   });

   return {
      customers, // Grouped by event_name
      monthlyData, // Optional monthly distribution of customers based on createdAt
   };
}
