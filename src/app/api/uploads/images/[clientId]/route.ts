import { getDataImagesByClientId } from '@/services/uploads/images/uploadClientImageService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const { clientId } = params;
   const response = await getDataImagesByClientId(jwtToken as string, clientId);

   if (response.status === 401) {
      return NextResponse.json({ message: 'unauthorized' }, { status: response.status });
   }

   return NextResponse.json(response, { status: response.status });
}
