import prisma from "@/libs/prisma";
import {
  createLogs,
  createQuestion,
  getLogs,
  sendMessage,
} from "@/services/testBlastingService";
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
    const logs = await prisma.logTestMessage.findMany();
    let newClientId = "";
    if (logs.length === 0) {
      newClientId = "CLID-1";
    } else {
      const lastData = logs[logs.length - 1].clientId.split("-")[1];
      newClientId = `CLID-${parseInt(lastData) + 1}`;
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
      "Will you be able to join us in celebrating our special day?",
      "Will you be bringing a guest?",
      "Do you have a favorite song you'd love to hear at our wedding reception?",
    ];

    for (const question of questionData) {
      await createQuestion(jwtToken as string, question, lastId.toString());
    }

    const response = await sendMessage(
      jwtToken as string,
      access_token,
      target_phone_number,
      event_name,
      sender,
      invitationLink
    );

    return NextResponse.json(response, { status: 200 });
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
