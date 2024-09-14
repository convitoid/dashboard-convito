import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { getSuccessReponse } from '@/utils/response/successResponse';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

interface Err extends Error {
   code: string;
   meta: {
      field_name: string;
   };
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
         logger.error(`Client not found`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const questions = await prisma.question.findMany({
         where: {
            client_id: getClientById.id,
         },
         orderBy: {
            position: 'asc',
         },
      });

      logger.info(`Questions fetched successfully for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         data: questions,
      });

      return NextResponse.json(
         {
            status: 'success',
            message: 'Questions fetched successfully',
            data: questions,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized`, {
            message: 'unauthorized',
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Failed to fetch questions for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         error: errorMessage.message,
      });

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { question, type } = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);
      if (question === '') {
         return NextResponse.json(
            {
               message: 'Question is required',
            },
            { status: 400 }
         );
      }

      if (type === '') {
         return NextResponse.json(
            {
               message: 'Type is required',
            },
            { status: 400 }
         );
      }

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
         logger.error(`Client not found`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const questions = await prisma.question.findMany({
         where: {
            client_id: getClientById.id,
         },
      });

      if (questions.length === 0) {
         const defaultQuestion =
            '<p>Please confirm your attendance, <strong>YES</strong> (joyfully accept), <strong>NO</strong> (regretfully decline) ?</p>';
         const defaultType = 'radio';
         const position = 1;

         const [createDefaultQuestion, createQuestion] = await prisma.$transaction([
            prisma.question.create({
               data: {
                  question: defaultQuestion,
                  type: defaultType,
                  position,
                  client_id: getClientById.id,
               },
            }),

            prisma.question.create({
               data: {
                  question,
                  type,
                  position: position + 1,
                  client_id: getClientById.id,
               },
            }),
         ]);

         logger.info(`Question created successfully for client: ${params.clientId}`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
            data: [createDefaultQuestion, createQuestion],
         });

         return NextResponse.json(
            {
               status: 'success',
               message: 'Question created successfully',
               data: [createDefaultQuestion, createQuestion],
            },
            { status: 201 }
         );
      } else {
         const position = questions.length + 1;

         const createQuestion = await prisma.question.create({
            data: {
               question,
               type,
               position,
               client_id: getClientById.id,
            },
         });

         logger.info(`Question created successfully for client: ${params.clientId}`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
            data: createQuestion,
         });

         return NextResponse.json(
            {
               status: 'success',
               message: 'Question created successfully',
               data: createQuestion,
            },
            { status: 201 }
         );
      }
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized`, {
            message: 'unauthorized',
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.info(`Failed to create question for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         error: errorMessage.message,
      });

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}

export async function PUT(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { id, question, type } = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
         logger.error(`Client not found`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const updateQuestion = await prisma.question.update({
         where: {
            id: Number(id),
            client_id: getClientById.id,
         },
         data: {
            question,
            type,
         },
      });

      if (!updateQuestion) {
         logger.error(`Question not found`, {
            questionId: id,
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Question not found',
            },
            { status: 404 }
         );
      }

      logger.info(`Question updated successfully for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         data: updateQuestion,
      });

      return NextResponse.json(
         {
            status: 201,
            message: 'Question updated successfully',
            data: updateQuestion,
         },
         { status: 201 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized`, {
            message: 'unauthorized',
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Failed to update question for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         error: errorMessage.message,
      });

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}

export async function DELETE(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { id } = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
         logger.error(`Client not found`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const deleteQuestion = await prisma.$transaction(async (tx) => {
         await tx.question.delete({
            where: {
               id: Number(id),
               client_id: getClientById.id,
            },
         });

         const remainingQuestions = await tx.question.findMany({
            orderBy: { position: 'asc' },
            where: {
               client_id: getClientById.id,
            },
         });

         for (let i = 0; i < remainingQuestions.length; i++) {
            const udpate = await tx.question.update({
               where: {
                  id: remainingQuestions[i].id,
               },
               data: {
                  position: i + 1,
               },
            });
         }
      });

      logger.info(`Question deleted successfully for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         data: deleteQuestion,
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'Question deleted successfully',
            data: deleteQuestion,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Err;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized`, {
            message: 'unauthorized',
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      if (
         errorMessage.code === 'P2003' &&
         errorMessage.meta.field_name === 'ScenarioQuestion_question_id_fkey (index)'
      ) {
         logger.error(`Cannot delete question because it is being used in a scenario`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Cannot delete template, it is being used in a scenario',
            },
            { status: 400 }
         );
      }

      if (errorMessage.code === 'P2003' && errorMessage.meta.field_name === 'Invitations_questionId_fkey (index)') {
         logger.error(`Cannot delete the question because invitations have already been sent`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}`,
         });
         return NextResponse.json(
            {
               message: 'Cannot delete the question because invitations have already been sent',
            },
            { status: 400 }
         );
      }

      logger.error(`Failed to delete question for client: ${params.clientId}`, {
         clientId: params.clientId,
         apiUrl: `/api/questions/${params.clientId}`,
         error: errorMessage.message,
      });

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
