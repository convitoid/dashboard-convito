import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma"; // Adjust the import path as needed
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";
import { fetchClientsService } from "@/services/clientService";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];
  const response = await fetchClientsService(jwtToken as string);

  return NextResponse.json(response, { status: response.status });
}
