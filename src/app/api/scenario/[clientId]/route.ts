import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
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

      if (!client) {
         return NextResponse.json(
            {
               status: 404,
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const scenarios = await prisma.scenario.findMany({
         where: {
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

      if (scenarios.length === 0) {
         return NextResponse.json(
            {
               status: 404,
               message: 'Scenarios not found',
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         status: 200,
         message: 'Scenarios retrieved successfully',
         data: scenarios,
      });
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      return NextResponse.json(
         {
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}

export async function DELETE(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const { id } = await req.json();

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
      });

      if (!client) {
         return NextResponse.json(
            {
               status: 404,
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const scenarios = await prisma.scenario.findFirst({
         where: {
            id: Number(id),
            client_id: Number(client?.id),
         },
      });

      if (!scenarios) {
         return NextResponse.json(
            {
               status: 404,
               message: 'Scenarios not found',
            },
            { status: 404 }
         );
      }

      const [deleteQuestion, deleteBroadcast, deleteScenario] = await prisma.$transaction([
         prisma.scenarioQuestion.deleteMany({
            where: {
               scenario_id: scenarios.id,
            },
         }),

         prisma.scenarioBroadcastTemplate.deleteMany({
            where: {
               scenario_id: scenarios.id,
            },
         }),

         prisma.scenario.delete({
            where: {
               id: scenarios.id,
            },
         }),
      ]);

      const data = {
         ScenarioQuestion: deleteQuestion,
         ScenarioBroadcastTemplate: deleteBroadcast,
         Scenario: deleteScenario,
      };

      return NextResponse.json({
         status: 200,
         message: 'Scenarios deleted successfully',
         data: data,
      });
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      return NextResponse.json(
         {
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
