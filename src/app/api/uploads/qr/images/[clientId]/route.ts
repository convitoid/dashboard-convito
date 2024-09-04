import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function POST(req: NextRequest, params: { params: { clientId: string } }) {
   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.params.clientId,
         },
      });

      if (!client) {
         return NextResponse.json({ status: 404, error: 'Client not found' }, { status: 404 });
      }

      const qrGalleryImage = await prisma.qrGalleryImage.findMany({
         where: {
            clientId: Number(client.id),
         },
      });

      return NextResponse.json({
         status: 200,
         message: 'Image successfully fetched',
         data: qrGalleryImage,
      });
   } catch (error) {
      return NextResponse.json({ status: 500, error: 'Failed to fetch image' }, { status: 500 });
   }
}

export async function DELETE(req: NextRequest, params: { params: { clientId: string } }) {
   const { imageId } = await req.json();

   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.params.clientId,
         },
      });

      if (!client) {
         return NextResponse.json({ status: 404, error: 'Client not found' }, { status: 404 });
      }

      const image = await prisma.qrGalleryImage.findFirst({
         where: {
            clientId: Number(client?.id),
            id: Number(imageId),
         },
      });

      if (!image) {
         return NextResponse.json({ status: 404, error: 'Image not found' }, { status: 404 });
      }

      if (image) {
         console.log(image.originalPath);
         await prisma.qrGalleryImage.delete({
            where: {
               id: image.id,
            },
         });

         await fs.unlink(image.originalPath);
         return NextResponse.json({
            status: 200,
            message: 'Image deleted successfully',
         });
      }
   } catch (error) {
      return NextResponse.json({ status: 500, error: 'Failed to delete image' }, { status: 500 });
   }
}
