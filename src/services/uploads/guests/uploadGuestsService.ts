import prisma from '@/libs/prisma';
import { convertToJson } from '@/utils/convertToJson';
import generateGuestId from '@/utils/generateGuestId';
import { getErrorResponse, getSuccessReponse } from '@/utils/response/successResponse';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { cleanString } from '@/utils/clearPhoneNumber';
import * as XLSX from 'xlsx';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export const createGuests = async (jwtToken: string, clientId: string, file: any) => {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);
      if (!file || !(file instanceof Blob)) {
         return NextResponse.json({ error: 'No file found' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
      const header = data[0];

      data.splice(0, 1);

      const newJson = await convertToJson(header as string[], data);

      const clients = await prisma.client.findFirst({
         where: {
            client_id: clientId,
         },
      });

      const guests = await prisma.guest.findMany({
         where: {
            clientId: clients?.id,
         },
         include: {
            GuestDetail: true,
         },
      });
      const isUpdateStatus = (status: string) => typeof status === 'string' && status.toLowerCase() === 'update';

      const filteredJson = newJson.filter((element) => element !== undefined && Object.keys(element).length > 0);
      const toUpdate = filteredJson.filter((guest) => isUpdateStatus(guest.STATUS));
      if (guests.length > 0) {
         //  update existing data
         if (toUpdate.length > 0) {
            toUpdate.forEach(async (element) => {
               const guestId = generateGuestId(element.NAME, clientId as string);

               const getClient = await prisma.client.findFirst({
                  select: {
                     id: true,
                  },
                  where: {
                     client_id: clientId?.toString(),
                  },
               });

               const guestData: any = {
                  guestId: guestId,
                  name: element.NAME,
                  scenario: element.SCENARIO,
                  scenario_slug: element.SCENARIO_SLUG,
                  createdAt: new Date(),
                  updatedAt: new Date(),
               };

               if (getClient?.id) {
                  guestData.clientId = getClient.id;
               }

               const createGuest = await prisma.guest.create({
                  data: guestData,
               });

               const guestDetail: any = Object.entries(element)
                  .filter(([key]) => key !== 'NAME' && key !== 'SCENARIO')
                  .map(([key, value]) => {
                     return {
                        detail_key: key.toLowerCase(),
                        detail_val: cleanString(String(value)),
                     };
                  });

               console.log('guestDetail 1', guestDetail);

               const createGuestDetail = await prisma.guestDetail.createMany({
                  data: guestDetail.map((detail: any) => {
                     return {
                        guestId: createGuest.id,
                        detail_key: detail.detail_key,
                        detail_val: cleanString(detail.detail_val),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                     };
                  }),
               });
            });
         } else {
            //  delete existing data
            // jika data yang diupload sama dengan data yang sudah ada
            const deleteGuestDetail = await prisma.guestDetail.deleteMany({
               where: {
                  guestId: {
                     in: guests.map((guest) => guest.id),
                  },
               },
            });

            const deleteGuest = await prisma.guest.deleteMany({
               where: {
                  clientId: clients?.id,
               },
            });

            //  insert data to database
            filteredJson.forEach(async (element) => {
               const guestId = generateGuestId(element.NAME, clientId as string);

               const getClient = await prisma.client.findFirst({
                  select: {
                     id: true,
                  },
                  where: {
                     client_id: clientId?.toString(),
                  },
               });

               const guestData: any = {
                  guestId: guestId,
                  name: element.NAME,
                  scenario: element.SCENARIO,
                  scenario_slug: element.SCENARIO_SLUG,
                  createdAt: new Date(),
                  updatedAt: new Date(),
               };

               if (getClient?.id) {
                  guestData.clientId = getClient.id;
               }

               const createGuest = await prisma.guest.create({
                  data: guestData,
               });

               const guestDetail: any = Object.entries(element)
                  .filter(([key]) => key !== 'NAME' && key !== 'SCENARIO')
                  .map(([key, value]) => {
                     return {
                        detail_key: key.toLowerCase(),
                        detail_val: cleanString(String(value)),
                     };
                  });

               console.log('guestDetail 2', guestDetail);

               const createGuestDetail = await prisma.guestDetail.createMany({
                  data: guestDetail.map((detail: any) => {
                     return {
                        guestId: createGuest.id,
                        detail_key: detail.detail_key,
                        detail_val: cleanString(detail.detail_val),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                     };
                  }),
               });
            });
         }
      } else {
         //   insert data to database
         newJson.forEach(async (element) => {
            const guestId = generateGuestId(element.NAME, clientId as string);

            const getClient = await prisma.client.findFirst({
               select: {
                  id: true,
               },
               where: {
                  client_id: clientId?.toString(),
               },
            });

            const guestData: any = {
               guestId: guestId,
               name: element.NAME,
               scenario: element.SCENARIO,
               scenario_slug: element.SCENARIO_SLUG,
               createdAt: new Date(),
               updatedAt: new Date(),
            };

            if (getClient?.id) {
               guestData.clientId = getClient.id;
            }

            const createGuest = await prisma.guest.create({
               data: guestData,
            });

            const guestDetail: any = Object.entries(element)
               .filter(([key]) => key !== 'NAME' && key !== 'SCENARIO')
               .map(([key, value]) => {
                  return {
                     detail_key: key.toLowerCase(),
                     detail_val: cleanString(String(value)),
                  };
               });

            console.log('guestDetail 3', guestDetail);

            const createGuestDetail = await prisma.guestDetail.createMany({
               data: guestDetail.map((detail: any) => {
                  return {
                     guestId: createGuest.id,
                     detail_key: detail.detail_key,
                     detail_val: cleanString(detail.detail_val),
                     createdAt: new Date(),
                     updatedAt: new Date(),
                  };
               }),
            });
         });
      }

      return getSuccessReponse(newJson, 201, 'Guests created successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return getErrorResponse(error as string, 401);
      }
      return getErrorResponse('Failed to fetch clients', 500);
   }
};
