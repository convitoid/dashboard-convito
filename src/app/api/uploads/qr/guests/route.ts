import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { convertToJson } from '@/utils/convertToJson';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { cleanString } from '@/utils/clearPhoneNumber';

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get('file');
      const clientId = formData.get('client_id');

      const token = req.headers.get('authorization');
      const jwtToken = token?.split(' ')[1];

      // const create = await createGuests(jwtToken as string, clientId as string, file);

      if (!file || !(file instanceof Blob)) {
         return NextResponse.json({ error: 'No file found' }, { status: 400 });
      }

      const arrayBuffer = Buffer.from(await file.arrayBuffer());

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const header = data[0];

      data.splice(0, 1);

      const newJson = await convertToJson(header as string[], data);

      const filteredData = newJson.filter((guests: any) => Object.keys(guests).length > 0);

      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },

         where: {
            client_id: clientId as string,
         },
      });

      const guests = await prisma.qrGuest.findMany({
         where: {
            clientId: client?.id,
         },
      });

      if (guests.length > 0) {
         const [deleteGuest, insertNewGuest] = await prisma.$transaction([
            prisma.qrGuest.deleteMany({
               where: {
                  clientId: client?.id,
               },
            }),
            prisma.qrGuest.createMany({
               data: filteredData.map((guest: any) => ({
                  clientId: Number(client?.id),
                  name: guest.NAME,
                  phoneNumber: cleanString(guest.PHONE_NUMBER.toString()),
                  qr_code: guest.QR_CODE,
                  createdAt: new Date(),
               })),
            }),
         ]);
      } else {
         filteredData.forEach(async (guest: any) => {
            await prisma.qrGuest.create({
               data: {
                  clientId: Number(client?.id),
                  name: guest.NAME,
                  phoneNumber: cleanString(guest.PHONE_NUMBER.toString()),
                  qr_code: guest.QR_CODE,
                  createdAt: new Date(),
               },
            });
         });
      }

      logger.info(`QR Guests uploaded successfully for client: ${clientId}`, {
         data: guests,
      });

      return NextResponse.json(
         {
            status: 201,
            message: 'Guests uploaded successfully',
            data: newJson,
         },
         { status: 201 }
      );
   } catch (error) {
      logger.error(`QR Error while uploading guests `, {
         error: (error as Error).message,
      });
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
   }
}
