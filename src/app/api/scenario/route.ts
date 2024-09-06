import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface JWTError extends Error {
   code?: string;
}

interface ErrorMessage {
   message: string;
   code: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function POST(req: NextRequest) {
   const body = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: body.clientId,
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

      if (!body.scenario_name) {
         return NextResponse.json(
            {
               status: 400,
               message: 'Invalid input',
            },
            { status: 400 }
         );
      }

      const scenario = await prisma.scenario.create({
         data: {
            scenario_name: body.scenario_name,
            scenario_slug: slugify(body.scenario_name, { lower: true, replacement: '-' }),
            client_id: Number(client?.id),
            createdAt: new Date(),
         },
      });

      const [questions, broadcast] = await prisma.$transaction([
         // Creating scenario questions
         ...body.question.map((question: any) =>
            prisma.scenarioQuestion.create({
               data: {
                  question_id: Number(question.id),
                  scenario_question: question.name,
                  status: question.status,
                  scenario_id: scenario.id,
               },
            })
         ),

         // Creating broadcast templates
         ...body.broadcast_template.map((template: any) =>
            prisma.scenarioBroadcastTemplate.create({
               data: {
                  broadcast_template_id: Number(template.id),
                  broadcast_template_scenario: template.name,
                  status: template.status,
                  scenario_id: scenario.id,
               },
            })
         ),
      ]);

      const response = {
         ...scenario,
         question: questions,
         broadcast: broadcast,
      };

      return NextResponse.json(
         {
            status: 201,
            message: 'Successfully created scenario',
            data: response,
         },
         { status: 201 }
      );
   } catch (error) {
      const errorMessage = error as ErrorMessage;
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
            message: {
               error: errorMessage?.message,
               code: errorMessage?.code,
            },
         },
         { status: 500 }
      );
   }
}

export async function PUT(req: NextRequest) {
   const body = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const updateScenario = await prisma.scenario.update({
         where: {
            id: Number(body.id),
         },
         data: {
            scenario_name: body.scenario_name,
            scenario_slug: slugify(body.scenario_name, { lower: true, replacement: '-' }),
         },
      });

      const [deleteScenarioQuestion, deleteScenarionTemplate] = await prisma.$transaction([
         prisma.scenarioQuestion.deleteMany({
            where: {
               scenario_id: Number(updateScenario.id),
            },
         }),
         prisma.scenarioBroadcastTemplate.deleteMany({
            where: {
               scenario_id: Number(updateScenario.id),
            },
         }),
      ]);

      const [createScenarioQuestion, createScenarionTemplate] = await prisma.$transaction([
         ...body.question.map((question: any) =>
            prisma.scenarioQuestion.create({
               data: {
                  question_id: Number(question.id),
                  scenario_question: question.name,
                  status: question.status,
                  scenario_id: updateScenario.id,
               },
            })
         ),
         ...body.broadcast_template.map((template: any) =>
            prisma.scenarioBroadcastTemplate.create({
               data: {
                  broadcast_template_id: Number(template.id),
                  broadcast_template_scenario: template.name,
                  status: template.status,
                  scenario_id: updateScenario.id,
               },
            })
         ),
      ]);

      const response = {
         ...updateScenario,
         question: createScenarioQuestion,
         broadcast: createScenarionTemplate,
      };

      return NextResponse.json(
         {
            status: 201,
            message: 'Scenario updated successfully',
            data: response,
         },
         { status: 201 }
      );
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
