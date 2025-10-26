import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/libs/prisma';
import generateGuestId from '@/utils/generateGuestId';
import { cleanString } from '@/utils/clearPhoneNumber';

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { clientId, guestData } = await request.json();

      if (!clientId || !guestData?.name) {
         return NextResponse.json({ error: 'Client ID and guest name are required' }, { status: 400 });
      }

      // Get client internal ID
      const client = await prisma.client.findFirst({
         where: { client_id: clientId },
         select: { id: true }
      });

      if (!client) {
         return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      // Generate unique guest ID
      const guestId = generateGuestId(guestData.name, clientId);

      // Check if guest with same guestId already exists
      const existingGuest = await prisma.guest.findFirst({
         where: { guestId }
      });

      if (existingGuest) {
         return NextResponse.json({ error: 'Guest with this name already exists for this client' }, { status: 409 });
      }

      // Create guest
      const newGuest = await prisma.guest.create({
         data: {
            guestId,
            name: guestData.name,
            scenario: guestData.scenario || '',
            scenario_slug: guestData.scenario ? guestData.scenario.toLowerCase().replace(/\s+/g, '_') : '',
            clientId: client.id,
            createdAt: new Date(),
         },
      });

      // Create guest details for additional fields
      const guestDetails = [];
      const fieldsToStore = ['phone_number', 'pax', 'kids_pax', 'holmat_pax', 'welcome_dinner_pax', 'hotel'];
      
      for (const field of fieldsToStore) {
         if (guestData[field] && guestData[field].toString().trim()) {
            guestDetails.push({
               guestId: newGuest.id,
               detail_key: field,
               detail_val: cleanString(guestData[field].toString()),
               createdAt: new Date(),
            });
         }
      }

      if (guestDetails.length > 0) {
         await prisma.guestDetail.createMany({
            data: guestDetails,
         });
      }

      return NextResponse.json({
         status: 201,
         message: 'Guest created successfully',
         data: { guestId: newGuest.guestId, name: newGuest.name }
      });

   } catch (error) {
      console.error('Error creating guest:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}