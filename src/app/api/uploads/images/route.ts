import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';
import {
   createDataImage,
   deleteDataImage,
   getDataImages,
   getDataImagesByClientId,
   updateDataImage,
} from '@/services/uploads/images/uploadClientImageService';
import prisma from '@/libs/prisma';
import logger from '@/libs/logger';

export async function GET(req: NextRequest) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const response = await getDataImages(jwtToken as string);
      if (response.status === 401) {
         logger.info(`Client images not found`, {
            error: 'Unauthorized',
         });
         return NextResponse.json({ mesage: 'unauthorized' }, { status: response.status });
      }

      logger.info(`Client images fetched successfully`, {
         data: response,
      });
      return NextResponse.json(response, { status: response.status });
   } catch (error) {
      logger.error(`Failed to fetch client images`, {
         error: (error as Error).message,
      });
      const errorMessage = error as Error;
      return NextResponse.json({ error: errorMessage.message }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   const formData = await req.formData();
   const file = formData.get('client_image');
   const clientCode = formData.get('client_code');
   const clientId = formData.get('client_id');
   const imageFlag = formData.get('image_flag');

   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   if (file && (file as Blob).size === 0) {
      logger.error(`Empty file found`, {
         error: 'Empty file found',
      });
      return NextResponse.json({ status: 400, error: 'Empty file found' }, { status: 400 });
   }

   if (!file || !(file instanceof Blob)) {
      logger.error(`No file found`, {
         error: 'No file found',
      });
      return NextResponse.json({ status: 400, error: 'No file found' }, { status: 400 });
   }

   const buffer = Buffer.from(await file.arrayBuffer());
   const unixTimestamp = Date.now();
   const uniqueIdentifier = Math.random().toString(36).substring(2, 15);
   const customFileName = `${unixTimestamp}-${clientCode}-${uniqueIdentifier}-${file.name}`;
   const filePath = join(process.cwd(), 'public/uploads/clients/images', customFileName);

   try {
      const response = await createDataImage(jwtToken as string, {
         clientId,
         imageName: customFileName,
         imagePath: '/uploads/clients/images/' + customFileName,
         imageOriginalPath: filePath,
         imageFlag: imageFlag,
      });

      if (response.status === 401) {
         logger.info(`Upload image failed`, {
            error: 'Unauthorized',
            apiUlr: '/api/uploads/images',
         });
         return NextResponse.json({ mesage: 'unauthorized' }, { status: response.status });
      }

      if (response.status === 400) {
         logger.error(`Upload image failed`, {
            error: 'Bad request',
            apiUlr: '/api/uploads/images',
         });
         return NextResponse.json(response, { status: response.status });
      }

      await fs.mkdir(join(process.cwd(), 'public/uploads/clients/images'), {
         recursive: true,
      });

      await fs.writeFile(filePath, new Uint8Array(buffer));

      logger.info(`Image uploaded successfully for client: ${clientId}`, {
         data: response,
      });

      return NextResponse.json(response, { status: response.status });
   } catch (error) {
      const errorMessage = error as Error;
      return NextResponse.json({ error: errorMessage.message }, { status: 500 });
   }
}

export async function DELETE(req: NextRequest) {
   const { clientId } = await req.json();

   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const images = await deleteDataImage(jwtToken as string, clientId);

      if (images.status === 401) {
         logger.info(`Delete image failed`, {
            error: 'Unauthorized',
            apiUlr: '/api/uploads/images',
         });
         return NextResponse.json({ message: 'unauthorized' }, { status: images.status });
      }

      if (images.status === 404) {
         logger.info(`No images found`, {
            error: 'No images found',
            apiUlr: '/api/uploads/images',
         });
         return NextResponse.json({ message: 'No images found' }, { status: images.status });
      }

      if ('data' in images) {
         const imageOriginalPath = images.data?.imageOriginalPath;
         await fs.unlink(imageOriginalPath);
      }

      logger.info(`Image deleted successfully for client: ${clientId}`, {
         data: images,
      });

      return NextResponse.json(images, { status: images.status });
   } catch (error) {
      logger.error(`Failed to delete image for client: ${clientId}`, {
         error: (error as Error).message,
      });

      const errorMessage = error as Error;
      return NextResponse.json({ error: errorMessage.message }, { status: 500 });
   }
}
