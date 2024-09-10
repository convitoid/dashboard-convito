import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   try {
      const client = await prisma.client.findFirst({
         select: {
            QrBroadcastTemplate: {
               select: {
                  id: true,
                  name: true,
                  type: true,
                  createdAt: true,
               },

               orderBy: {
                  createdAt: 'desc',
               },
            },
         },
         where: {
            client_id: params.clientId,
         },
      });

      return NextResponse.json(
         {
            message: 'Fetch data',
            data: client,
         },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         {
            message: error as Error,
         },
         { status: 500 }
      );
   }
}

export async function PUT(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { id, name, type } = await req.json();
   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      console.log('data', id, name, type);

      const template = await prisma.qrBroadcastTemplate.findMany({
         where: {
            clientId: Number(client?.id),
            type: type,
         },
      });

      const updateQrBroadcastTemplate = await prisma.qrBroadcastTemplate.update({
         where: {
            id: id,
            clientId: Number(client?.id),
         },
         data: {
            name: name,
            type: type,
         },
      });

      return NextResponse.json(
         {
            status: 201,
            message: 'Create data',
            data: updateQrBroadcastTemplate,
         },
         { status: 201 }
      );
   } catch (error) {
      return NextResponse.json(
         {
            status: 500,
            message: error as Error,
         },
         { status: 500 }
      );
   }
}

export async function DELETE(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { id } = await req.json();

   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      const deleteQrBroadcastTemplate = await prisma.qrBroadcastTemplate.delete({
         where: {
            id: id,
            clientId: Number(client?.id),
         },
      });

      return NextResponse.json({
         status: 200,
         message: 'Delete data',
         data: deleteQrBroadcastTemplate,
      });
   } catch (error) {
      return NextResponse.json(
         {
            status: 500,
            message: error as Error,
         },
         { status: 500 }
      );
   }
}
