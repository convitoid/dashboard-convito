import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma'; // Adjust the import path as needed
import { getErrorResponse, getSuccessReponse } from '@/utils/response/successResponse';
import {
   addClientService,
   deleteClientService,
   fetchClientsService,
   updateClientService,
} from '@/services/clientService';
import { createClientValidation } from '@/utils/formValidation/clients/createValidation';
import moment from 'moment';

export async function GET(req: NextRequest) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const response = await fetchClientsService(jwtToken as string);

   return NextResponse.json(response, { status: response.status });
}

export async function POST(req: NextRequest) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const { client_name, event_title, event_name, event_date, event_type, createdBy, updatedBy } = await req.json();

   try {
      const clients = await prisma.client.findMany({
         orderBy: {
            id: 'desc',
         },
      });

      let newClientId;
      if (clients.length === 0) {
         newClientId = 'CL-0001';
      } else {
         const lastData = clients[0].client_id.split('-')[1];
         const increment = parseInt(lastData, 10) + 1;
         newClientId = `CL-${increment.toString().padStart(4, '0')}`;
      }

      const data = {
         jwtToken,
         client_id: newClientId,
         client_name,
         event_title,
         event_name,
         event_date,
         event_type,
         createdBy,
         updatedBy,
      };

      const response = await addClientService(data);
      return NextResponse.json(response, { status: response.status });
   } catch (error) {
      return NextResponse.json(error, { status: 500 });
   }
}

export async function PUT(req: NextRequest) {
   const { client_id, client_name, event_title, event_name, event_date, event_type, updated_by } = await req.json();

   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   let data = {
      client_id,
      client_name,
      event_title,
      event_name,
      event_date,
      event_type,
      updated_by,
   };

   data.event_date = new Date(data.event_date);

   // console.log('data', data);
   // return NextResponse.json(data);

   const validation = createClientValidation(data);
   if (Object.keys(validation).length > 0) {
      return NextResponse.json(
         {
            message: 'Validation error',
            error: validation,
         },
         { status: 400 }
      );
   }

   try {
      const updateClient = await updateClientService(jwtToken as string, {
         ...data,
         updatedAt: new Date(),
         updatedBy: updated_by,
      });

      if (updateClient.status === 500) {
         return NextResponse.json(updateClient, { status: 500 });
      }

      return NextResponse.json(updateClient, { status: 201 });
   } catch (error) {
      return NextResponse.json(error, { status: 500 });
   }
}

export async function DELETE(req: NextRequest) {
   const { client_id } = await req.json();
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const response = await deleteClientService(jwtToken as string, Number(client_id));

      return NextResponse.json(response, { status: response.status });
   } catch (error) {
      console.log('error', error);
      return NextResponse.json(error, { status: 500 });
   }
}
