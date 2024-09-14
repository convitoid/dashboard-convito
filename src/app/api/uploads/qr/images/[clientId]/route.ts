import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import logger from '@/libs/logger';

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

      const fullPath = qrGalleryImage.map((image) => {
         return {
            ...image,
            imagePath: path.join(process.cwd(), `public/uploads/clients/qr/images/${image.name}`),
         };
      });

      const imageUrl = await Promise.all(
         qrGalleryImage.map(async (image) => {
            const url = `${process.env.NEXTAUTH_URL}/api/qr/render-image/qr-gallery/${image.name}`;
            const respone = await fetch(url);
            return respone.url;
         })
      );

      // gabungkan imageUrl dengan qrGalleryImage
      const resData = qrGalleryImage.map((image, index) => {
         return {
            ...image,
            imageUrl: imageUrl[index],
         };
      });

      logger.info('Image successfully fetched', { clientId: params.params.clientId, data: resData });
      return NextResponse.json({
         status: 200,
         message: 'Image successfully fetched',
         data: resData,
      });
   } catch (error: any) {
      logger.error('Failed to fetch image', { clientId: params.params.clientId, error: error.message });
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
         await prisma.qrGalleryImage.delete({
            where: {
               id: image.id,
            },
         });

         await fs.unlink(image.originalPath);
         logger.info(`Image deleted successfully: ${image.name} for client: ${params.params.clientId}`);
         return NextResponse.json({
            status: 200,
            message: 'Image deleted successfully',
         });
      }
   } catch (error: any) {
      logger.error('Failed to delete image', { clientId: params.params.clientId, error: error.message });
      return NextResponse.json({ status: 500, error: 'Failed to delete image' }, { status: 500 });
   }
}
