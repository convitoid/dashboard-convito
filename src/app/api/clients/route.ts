import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma"; // Adjust the import path as needed
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";

export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany();
    const response = getSuccessReponse(
      clients,
      200,
      "Clients data fetched successfully"
    );
    return NextResponse.json(response);
  } catch (error) {
    const response = getErrorResponse("Failed to fetch clients", 500);
    return NextResponse.json(response, { status: 500 });
  }
}
