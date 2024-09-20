import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { sendBlastingService } from '@/services/sendBlastingService';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

interface ErrorMessage {
   message: string;
   code: string;
}

interface Response {
   status: number;
   message: string;
   error?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const body = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const { clientId } = params;

   try {
      // Verify JWT
      const { payload } = await jwtVerify(jwtToken as string, secret);

      // Find the client
      const client = await prisma.client.findFirst({
         select: {
            id: true,
            client_id: true,
         },
         where: {
            client_id: clientId,
         },
      });

      if (!client) {
         return NextResponse.json({ status: 404, message: 'Client not found' }, { status: 404 });
      }

      // Process data and fetch scenarios
      const blasting = await Promise.all(
         body.map(async (data: any) => {
            const scenario = await prisma.scenario.findMany({
               where: {
                  client_id: Number(client?.id),
                  scenario_slug: data.scenario,
               },
               include: {
                  ScenarioBroadcastTemplate: {
                     include: {
                        BroadcastTemplate: true,
                     },
                  },
               },
            });

            const broadcastTemplate = scenario.map((s: any) => {
               // ambil broadcast_template_scenario
               return s.ScenarioBroadcastTemplate;
            });

            return {
               ...data,
               broadcastTemplate: broadcastTemplate,
            };
         })
      );

      // Flatten the results if needed
      const flattenedResults = blasting.flat();
      const response = (await sendBlastingService(flattenedResults as any, Number(client?.id), clientId)) as Response;

      console.log(response);

      logger.info(`Blasting sent successfully for client: ${clientId}`, {
         data: response,
      });

      return NextResponse.json({ status: response.status, message: response.message }, { status: response.status });
   } catch (error) {
      const errorMessage = error as ErrorMessage;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`JWT error: ${jwtError.message}`, {
            error: jwtError,
         });
         return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
      }

      logger.error(`Error sending blasting for client: ${clientId}`, {
         data: errorMessage.message,
      });

      return NextResponse.json(
         {
            status: 500,
            message: {
               error: errorMessage?.message,
               code: errorMessage?.code,
            },
         },
         { status: 500 }
      );
   }
}
