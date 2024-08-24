import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('Authorization');
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

      const response = await prisma.broadcastTemplate.findMany({
         where: {
            client_id: Number(client?.id),
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      return NextResponse.json(
         {
            status: 'success',
            data: response,
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
   let { name, template_type } = await req.json();
   const token = req.headers.get('Authorization');
   const jwtToken = token?.split(' ')[1];

   if (name === '') {
      return NextResponse.json(
         {
            status: 400,
            error: 'Invalid input',
            message: 'Please provide a valid clientId and name',
         },
         { status: 400 }
      );
   }

   if (name.includes(' ')) {
      name = name.replace(/\s/g, '_').toLowerCase();
   }

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

      const response = await prisma.broadcastTemplate.create({
         data: {
            client_id: Number(client?.id),
            template_name: name,
            template_type: template_type,
         },
      });

      return NextResponse.json(
         {
            status: 201,
            message: 'Broadcast template created successfully',
            data: {
               name,
               template_type,
            },
         },
         { status: 201 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               status: 401,
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

export async function PUT(req: NextRequest, { params }: { params: { clientId: string } }) {
   let { id, name, template_type } = await req.json();
   const token = req.headers.get('Authorization');
   const jwtToken = token?.split(' ')[1];

   if (id === '' || name === '') {
      return NextResponse.json(
         {
            status: 400,
            error: 'Invalid input',
            message: 'Please provide a valid name',
         },
         { status: 400 }
      );
   }

   // if name whitespace make it to _ and lowercase like template_example
   if (name.includes(' ')) {
      name = name.replace(/\s/g, '_').toLowerCase();
   }

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

      const response = await prisma.broadcastTemplate.update({
         where: {
            id: Number(id),
            client_id: Number(client?.id),
         },
         data: {
            template_name: name,
            template_type: template_type,
         },
      });

      return NextResponse.json(
         {
            status: 201,
            message: 'Broadcast template updated successfully',
            data: {
               id,
               name,
               template_type,
            },
         },
         { status: 201 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               status: 401,
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
   const { id } = await req.json();
   const token = req.headers.get('Authorization');
   const jwtToken = token?.split(' ')[1];

   if (id === '') {
      return NextResponse.json(
         {
            status: 400,
            error: 'Invalid input',
            message: 'Please provide a valid id',
         },
         { status: 400 }
      );
   }

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

      const response = await prisma.broadcastTemplate.delete({
         where: {
            id: Number(id),
            client_id: Number(client?.id),
         },
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'Broadcast template deleted successfully',
            data: response,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         return NextResponse.json(
            {
               status: 401,
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
