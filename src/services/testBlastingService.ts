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

    let jsonData: any;

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
    return getErrorResponse("Failed to send message", 500);
  }
}
