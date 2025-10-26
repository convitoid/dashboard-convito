import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/libs/prisma';

export async function PATCH(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      // Skip auth check for now
      // const session = await getServerSession();
      // if (!session) {
      //    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }

      const { excluded } = await request.json();
      const guestId = parseInt(params.id);

      // First, check if guest exists and get client info
      const guest = await prisma.guest.findUnique({
         where: { id: guestId },
         include: { Client: true }
      });

      if (!guest) {
         return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
      }

      // TODO: Add proper authorization check here
      // Example: Check if current user has access to this client
      // const hasAccess = await checkUserClientAccess(session.user.id, guest.clientId);
      // if (!hasAccess) {
      //    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      // }

      const updatedGuest = await prisma.guest.update({
         where: { id: guestId },
         data: { excluded_from_broadcast: excluded }
      });

      return NextResponse.json({ 
         success: true, 
         excluded_from_broadcast: updatedGuest.excluded_from_broadcast 
      });

   } catch (error) {
      console.error('Error updating broadcast status:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}