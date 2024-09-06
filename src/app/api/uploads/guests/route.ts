import { createGuests } from '@/services/uploads/guests/uploadGuestsService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get('file');
      const clientId = formData.get('client_id');

      const token = req.headers.get('authorization');
      const jwtToken = token?.split(' ')[1];

      const create = await createGuests(jwtToken as string, clientId as string, file);

      console.log(create);

      return NextResponse.json(create, { status: create.status });
   } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
   }
}
