import prisma from '@/libs/prisma';

export async function getMonthlyCustomerData() {
   const startOfYear = new Date(new Date().getFullYear(), 0, 1);
   const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

   const customers = await prisma.client.groupBy({
      by: ['createdAt'],
      _count: {
         id: true,
      },
      where: {
         createdAt: {
            gte: startOfYear,
            lt: endOfYear,
         },
      },
      orderBy: {
         createdAt: 'asc',
      },
   });

   const monthlyData = Array(12).fill(0);
   customers.forEach((customer) => {
      const month = new Date(customer.createdAt).getMonth();
      monthlyData[month] += customer._count.id;
   });

   return monthlyData;
}
