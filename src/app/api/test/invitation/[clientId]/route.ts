import prisma from "@/libs/prisma";
import { invitationGuest } from "@/services/testBlastingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const clientId = params.clientId;

  try {
    const response = await invitationGuest(clientId);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ message: "Hello from POST" });
}
