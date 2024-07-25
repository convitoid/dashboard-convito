import prisma from "@/libs/prisma";
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";
import { jwtVerify } from "jose";

interface JWTError extends Error {
  code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "");

export async function fetchClientsService(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const clients = await prisma.client.findMany();
    const response = getSuccessReponse(
      clients,
      200,
      "Clients data fetched successfully"
    );
    return getSuccessReponse(clients, 200, "Clients data fetched successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    console.log(error);
    return getErrorResponse("Failed to fetch clients", 500);
  }
}
