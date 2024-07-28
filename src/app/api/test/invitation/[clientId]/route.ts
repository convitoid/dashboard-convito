import prisma from "@/libs/prisma";
import { invitationGuest, updateAnsware } from "@/services/testBlastingService";
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

export async function PUT(req: NextRequest) {
  const { questionId, answer } = await req.json();

  try {
    const response = await updateAnsware(questionId, answer);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
