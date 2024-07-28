import prisma from "@/libs/prisma";
import {
  createLogs,
  createQuestion,
  getLogs,
  sendMessage,
} from "@/services/testBlastingService";
import { faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    access_token,
    target_phone_number,
    event_name,
    sender,
    invitation_link,
  } = await req.json();

  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  try {
    const logs = await prisma.logTestMessage.findMany({
      orderBy: {
        id: "desc",
      },
    });

    let newClientId;
    if (logs.length === 0) {
      newClientId = "CL-0001";
    } else {
      const lastData = logs[logs.length - 1].clientId.split("-")[1];
      const increment = parseInt(lastData, 10) + 1;
      console.log("increment", increment);
      newClientId = `CL-${increment.toString().padStart(4, "0")}`;
    }

    await createLogs(
      jwtToken as string,
      target_phone_number,
      event_name,
      sender,
      invitation_link,
      newClientId
    );

    const getLogs = await prisma.logTestMessage.findMany();
    const lastId = getLogs[getLogs.length - 1].id;
    const invitationLink = getLogs[getLogs.length - 1].invitationLink;
    console.log("lastId", invitationLink);

    const questionData = [
      {
        question:
          "Please confirm your attendance, YES (joyfully accept), NO (regretfully decline)",
        type: "select",
      },
      {
        question:
          "This invitation is valid for 2 Guest(s), how many guest will attend?",
        type: "number",
      },
      {
        question:
          "Are any guest vegetarian? (Optional) Example: Bambang - Vegetarian / Adeline Vegetarian",
        type: "text",
      },
      {
        question:
          "You are also invited in The Holy Matrimony of Mr. Convito & Ms. Convito for 2 Guest(s), how many guest will attend?",
        type: "number",
      },
    ];

    // loop questionData
    questionData.map(async (question) => {
      await createQuestion(
        jwtToken as string,
        question.question,
        newClientId,
        question.type
      );
    });

    const response = await sendMessage(
      jwtToken as string,
      access_token,
      target_phone_number,
      event_name,
      sender,
      invitationLink
    );

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];
  try {
    const response = await getLogs(jwtToken as string);
    return NextResponse.json(response, { status: response.status });
  } catch (error) {}
  return NextResponse.json({ message: "Hello" });
}
