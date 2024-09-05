import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function POST(req: NextRequest) {
   const formData = await req.formData();
   const file = formData.get('client_image');
   const clientId = formData.get('client_id');

   if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ status: 400, error: 'No file found' }, { status: 400 });
   }

   if (file && (file as Blob).size === 0) {
      return NextResponse.json({ status: 400, error: 'Empty file found' }, { status: 400 });
   }

   const buffer = Buffer.from(await file.arrayBuffer());
   const unixTimestamp = Date.now();
   const uniqueIdentifier = Math.random().toString(36).substring(2, 15);
   const customFileName = `${unixTimestamp}-${uniqueIdentifier}-${file.name}`;
   const filePath = join(process.cwd(), 'public/uploads/clients/qr/images', customFileName);

   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: clientId as string,
         },
      });

      if (!client) {
         return NextResponse.json({ status: 404, error: 'Client not found' }, { status: 404 });
      }

      const response = await prisma.qrGalleryImage.create({
         data: {
            clientId: Number(client.id),
            name: customFileName,
            path: '/uploads/clients/qr/images/' + customFileName,
            originalPath: filePath,
            createdAt: new Date(),
         },
      });

      await fs.mkdir(join(process.cwd(), 'public/uploads/clients/qr/images'), { recursive: true });
      await fs.writeFile(filePath, new Uint8Array(buffer));

      return NextResponse.json({ status: 200, message: 'Image uploaded successfully', data: response });
   } catch (error) {
      return NextResponse.json({ status: 500, error: 'Failed to upload image' }, { status: 500 });
   }
}
