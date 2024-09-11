import prisma from '@/libs/prisma';
import { convertToJson } from '@/utils/convertToJson';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get('file');
      const clientId = formData.get('client_id');

      const token = req.headers.get('authorization');
      const jwtToken = token?.split(' ')[1];

      // const create = await createGuests(jwtToken as string, clientId as string, file);
      console.log('file', file);
      console.log('clientId', clientId);

      if (!file || !(file instanceof Blob)) {
         return NextResponse.json({ error: 'No file found' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const header = data[0];

      data.splice(0, 1);

      const newJson = await convertToJson(header as string[], data);

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
               data: newJson.map((guest: any) => ({
                  clientId: Number(client?.id),
                  name: guest.NAME,
                  phoneNumber: guest.PHONE_NUMBER,
                  qr_code: guest.QR_CODE,
                  createdAt: new Date(),
               })),
            }),
         ]);
      } else {
         newJson.forEach(async (guest: any) => {
            await prisma.qrGuest.create({
               data: {
                  clientId: Number(client?.id),
                  name: guest.NAME,
                  phoneNumber: guest.PHONE_NUMBER,
                  qr_code: guest.QR_CODE,
                  createdAt: new Date(),
               },
            });
         });
      }

      return NextResponse.json(
         {
            status: 201,
            message: 'Guests uploaded successfully',
            data: newJson,
         },
         { status: 201 }
      );
   } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
   }
}
