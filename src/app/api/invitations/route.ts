import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
   const guests = await prisma.guest.findMany();

   const test = await Promise.all(
      guests.map(async (guest) => {
         const scenario = await prisma.scenario.findMany({
            where: {
               scenario_slug: guest.scenario_slug,
            },
            include: {
               ScenarioQuestion: true,
            },
         });

         const scenarioQuestion = scenario.map((s) => {
            return s.ScenarioQuestion;
         });

         return {
            guest_id: guest.id,
            guest_code: guest.guestId,
            guest_name: guest.name,
            client_id: guest.clientId,
            scenario_question: scenarioQuestion,
         };
      })
   );

   return NextResponse.json({
      message: 'Hello',
      data: test,
   });
}
