import prisma from '@/libs/prisma';
import { getErrorResponse, getSuccessReponse } from '@/utils/response/successResponse';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function getDataImages(jwtToken: string) {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);

      const images = await prisma.clientImage.findMany({
         orderBy: {
            createdAt: 'desc',
         },
      });

      return getSuccessReponse(images, 200, 'Images data fetched successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return { error: error as string, status: 401 };
      }

      if (jwtError.code === 'ERR_JWS_INVALID') {
         return getErrorResponse('unauthorized', 401);
      }

      return { error: 'Failed to fetch images', status: 500 };
   }
}
export async function getDataImagesByClientId(jwtToken: string, clientId: string) {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);

      const images = await prisma.clientImage.findMany({
         where: {
            clientId: Number(clientId),
         },
      });

      if (!images) {
         return getErrorResponse('No images found', 404);
      }

      return getSuccessReponse(images, 200, 'Images data fetched successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return { error: error as string, status: 401 };
      }

      if (jwtError.code === 'ERR_JWS_INVALID') {
         return getErrorResponse('unauthorized', 401);
      }

      return { error: 'Failed to fetch images', status: 500 };
   }
}

export async function createDataImage(jwtToken: string, data: any) {
   // console.log('data', data);
   try {
      // const { payload } = await jwtVerify(jwtToken, secret);

      const checkFlag = await prisma.clientImage.findFirst({
         where: {
            flag: data.imageFlag,
         },
      });

      if (checkFlag) {
         return getErrorResponse('Image type already exists', 400);
      }

      const response = await prisma.clientImage.create({
         data: {
            clientId: Number(data.clientId),
            imageName: data.imageName,
            imagePath: data.imagePath,
            imageOriginalPath: data.imageOriginalPath,
            flag: data.imageFlag,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      return getSuccessReponse(checkFlag, 201, 'Image added successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return { error: error as string, status: 401 };
      }

      if (jwtError.code === 'ERR_JWS_INVALID') {
         return getErrorResponse('unauthorized', 401);
      }

      return { error: 'Failed to fetch images', status: 500 };
   }
}

export async function updateDataImage(jwtToken: string, data: any) {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);

      const response = await prisma.clientImage.update({
         where: {
            id: data.id,
            clientId: Number(data.clientId),
         },
         data: {
            imageName: data.imageName,
            imagePath: data.imagePath,
            imageOriginalPath: data.imageOriginalPath,
            updatedAt: new Date(),
         },
      });

      return getSuccessReponse(response, 200, 'Image updated successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return { error: error as string, status: 401 };
      }

      if (jwtError.code === 'ERR_JWS_INVALID') {
         return getErrorResponse('unauthorized', 401);
      }

      return { error: 'Failed to fetch images', status: 500 };
   }
}

export async function deleteDataImage(jwtToken: string, data: any) {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);

      const response = await prisma.clientImage.delete({
         where: {
            id: Number(data),
         },
      });

      return getSuccessReponse(response, 200, 'Image deleted successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return { error: error as string, status: 401 };
      }
      if (jwtError.code === 'ERR_JWS_INVALID') {
         return getErrorResponse('unauthorized', 401);
      }
      return { error: 'Failed to fetch images', status: 500 };
   }
}
