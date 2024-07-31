import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma"; // Adjust the import path as needed
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";
import {
  addClientService,
  fetchClientsService,
} from "@/services/clientService";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];
  const response = await fetchClientsService(jwtToken as string);

  return NextResponse.json(response, { status: response.status });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];
  const {
    client_name,
    event_name,
    event_date,
    event_type,
    createdBy,
    updatedBy,
  } = await req.json();

  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        id: "desc",
      },
    });

    let newClientId;
    if (clients.length === 0) {
      newClientId = "CL-0001";
    } else {
      const lastData = clients[0].client_id.split("-")[1];
      const increment = parseInt(lastData, 10) + 1;
      newClientId = `CL-${increment.toString().padStart(4, "0")}`;
    }

    const data = {
      jwtToken,
      client_id: newClientId,
      client_name,
      event_name,
      event_date,
      event_type,
      createdBy,
      updatedBy,
    };

    const response = await addClientService(data);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
