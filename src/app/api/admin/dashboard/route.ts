import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { getMonthlyCustomerData } from '@/services/chartService';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
   try {
      const clients = await prisma.client.count();
      const guests = await prisma.guest.count();

      const clientData = await prisma.client.findMany();
      const guestData = await prisma.guest.findMany();

      const chartClientData = await getMonthlyCustomerData();

      const data = {
         clients: clientData,
         guests: guestData,
         totalClients: chartClientData.customers.length,
         totalGuests: guests,
         chartClientData: chartClientData.monthlyData,
      };

      logger.info('Data admin dashboard fetched successfully', data);

      revalidatePath(req.nextUrl.pathname);

      return NextResponse.json(
         {
            status: 200,
            message: 'Data fetched successfully',
            data: data,
         },
         { status: 200 }
      );
   } catch (error) {
      logger.error('Error fetch data admin dashboard', error);

      return NextResponse.json(
         {
            status: 500,
            message: 'Error fetch data admin dashboard',
         },
         { status: 500 }
      );
   }
}
