import prisma from "@/libs/prisma";
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";
import { jwtVerify } from "jose";
import { useSession } from "next-auth/react";

interface JWTError extends Error {
  code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "");

export async function fetchClientsService(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("clients", clients);

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

export async function addClientService(data: any) {
  console.log("data from service", data);
  try {
    const { payload } = await jwtVerify(data.jwtToken, secret);
    const client = await prisma.client.create({
      data: {
        client_id: data.client_id,
        client_name: data.client_name,
        event_name: data.event_name,
        event_date: data.event_date,
        event_type: data.event_type,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: data.updatedBy,
        createdBy: data.createdBy,
      },
    });
    return getSuccessReponse(client, 201, "Client added successfully");
  } catch (error) {
    return getErrorResponse("Failed to add client", 500);
  }
}
