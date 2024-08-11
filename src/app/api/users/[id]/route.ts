import { fetchUserById } from '@/services/userService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: number } }
) {
    const { id } = params;
    const token = req.headers.get('authorization');
    const jwtToken = token?.split(' ')[1];
    const response = await fetchUserById(jwtToken as string, Number(id));

    return NextResponse.json(response, { status: response.status });
}
