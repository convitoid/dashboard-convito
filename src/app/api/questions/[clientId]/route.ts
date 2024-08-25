import prisma from '@/libs/prisma';
import { getSuccessReponse } from '@/utils/response/successResponse';
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

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
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
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

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
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

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
         return NextResponse.json(
            {
               message: 'Question not found',
            },
            { status: 404 }
         );
      }

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
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

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
         });

         console.log('remainingQuestions', remainingQuestions);

         for (let i = 0; i < remainingQuestions.length; i++) {
            const udpate = await tx.question.update({
               where: {
                  id: remainingQuestions[i].id,
               },
               data: {
                  position: i + 1,
               },
            });

            console.log('udpate', udpate);
         }
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
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
