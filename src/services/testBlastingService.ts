import prisma from "@/libs/prisma";
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";
import { faker } from "@faker-js/faker";
import { jwtVerify } from "jose";

interface JWTError extends Error {
  code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "");

export async function sendMessage(
  jwtToken: string,
  authToken: string,
  to: string,
  guest_name: string,
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
        name: "testing_rsv",
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: guest_name,
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
  guest_name: string,
  event_name: string,
  sender: string,
  invitation_link: string,
  clientId: string
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    console.log(
      "dari service",
      to,
      clientId,
      guest_name,
      event_name,
      sender,
      invitation_link
    );

    const logs = await prisma.logTestMessage.create({
      data: {
        clientId: clientId,
        clientName: guest_name,
        phoneNumber: to,
        eventName: event_name,
        senderName: sender,
        invitationLink: `${invitation_link}/${clientId}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("data dari service", logs);

    return getSuccessReponse(logs, 200, "Logs created successfully");
  } catch (error) {
    return getErrorResponse(error as string, 500);
  }
}

export async function createQuestion(
  jwtToken: string,
  questionLog: string,
  guestLog: string,
  type: string,
  flag?: string,
  position?: number
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    console.log("dari service", questionLog, guestLog, type, flag);

    const question = await prisma.logTestQuestion.create({
      data: {
        question: questionLog,
        type: type,
        idLogTestMessage: Number(guestLog),
        flag: flag,
        position: position,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("data dari service", question);

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
        clientName: true,
      },
      where: {
        clientId: clientId,
      },
    });

    if (!response) {
      return getErrorResponse("Invitation guest not found", 404);
    }

    const questions = await prisma.logTestQuestion.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        type: true,
        flag: true,
        position: true,
      },
      where: {
        idLogTestMessage: response?.id,
      },
      orderBy: {
        position: "asc",
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

export const updateAnsware = async (questionId: string, answer: string) => {
  try {
    const response = await prisma.logTestQuestion.update({
      where: {
        id: parseInt(questionId),
      },
      data: {
        answer: answer,
        updatedAt: new Date(),
      },
    });

    return getSuccessReponse(response, 200, "Answer submitted successfullyss");
  } catch (error) {
    return getErrorResponse("Failed to create question", 500);
  }
};
