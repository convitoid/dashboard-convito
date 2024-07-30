import prisma from "@/libs/prisma";
import { getSuccessReponse } from "@/utils/response/successResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { client_id: String(slug) },
    });

    const response = getSuccessReponse(
      client,
      200,
      "Client data fetched successfully"
    );

    if (client) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Client not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch client",
      },
      { status: 500 }
    );
  }
}
