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

export async function sendMessage(
  jwtToken: string,
  authToken: string,
  to: string,
  event_name: string,
  sender: string,
  invitation_link: string
) {
  console.log("dari service", authToken);
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      // `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`
      `Bearer ${authToken}`
    );

    const raw = JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "testing_rsv ",
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: event_name,
              },
              {
                type: "text",
                text: sender,
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
              {
                type: "text",
                text: invitation_link,
              },
            ],
          },
        ],
      },
    });

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
    return response;
  } catch (error) {
    return getErrorResponse(error as string, 500);
  }
}

export async function createLogs(
  jwtToken: string,
  to: string,
  event_name: string,
  sender: string,
  invitation_link: string,
  clientId: string
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    const logs = await prisma.logTestMessage.create({
      data: {
        clientId: clientId,
        phoneNumber: to,
        eventName: event_name,
        senderName: sender,
        invitationLink: `${invitation_link}/${clientId}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return getSuccessReponse(logs, 200, "Logs created successfully");
  } catch (error) {
    return getErrorResponse(error as string, 500);
  }
}

export async function createQuestion(
  jwtToken: string,
  questionLog: string,
  guestLog: string
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    const question = await prisma.logTestQuestion.create({
      data: {
        question: questionLog,
        idLogTestMessage: Number(guestLog),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return getSuccessReponse(question, 200, "Question created successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    return getErrorResponse("Failed to create question", 500);
  }
}

export async function getLogs(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    const logs = await prisma.logTestMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return getSuccessReponse(logs, 200, "Logs fetched successfully");
  } catch (error) {
    return getErrorResponse(error as string, 500);
  }
}

export async function invitationGuest(clientId: string) {
  try {
    const response = await prisma.logTestMessage.findFirst({
      select: {
        id: true,
        clientId: true,
        eventName: true,
        senderName: true,
      },
      where: {
        clientId: clientId,
      },
    });

    console.log("response api", response);

    const questions = await prisma.logTestQuestion.findFirst({
      select: {
        id: true,
        question: true,
        answer: true,
      },
      where: {
        idLogTestMessage: response?.id,
      },
    });

    return getSuccessReponse(
      {
        ...response,
        questions: questions,
      },
      200,
      "Invitation guest fetched successfully"
    );
  } catch (error) {
    return getErrorResponse(error as string, 500);
  }
}
