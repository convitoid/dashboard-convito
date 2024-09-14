import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string; id: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      const scenario = await prisma.scenario.findFirst({
         where: {
            id: Number(params.id),
            client_id: Number(client?.id),
         },
         include: {
            ScenarioQuestion: true,
            ScenarioBroadcastTemplate: true,
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      logger.info(`Scenario fetched successfully for client: ${params.clientId}`, {
         data: scenario,
      });

      return NextResponse.json({
         status: 200,
         message: 'Scenario retrieved successfully',
         data: scenario,
      });
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`JWT error: ${jwtError.message}`, {
            error: jwtError,
         });
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Error fetching scenario for client: ${params.clientId}`, {
         data: errorMessage.message,
      });

      return NextResponse.json(
         {
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
