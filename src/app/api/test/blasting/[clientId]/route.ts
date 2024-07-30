import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const id = params.clientId;
  console.log(id);

  const log = await prisma.logTestMessage.findMany({
    where: {
      clientId: id,
    },
  });

  const questionLog = await prisma.logTestQuestion.findMany({
    where: {
      idLogTestMessage: log[0].id,
    },
  });

  const newJson = {
    ...log[0],
    questionLog: questionLog,
  };
  console.log("dari server", newJson);

  return NextResponse.json(newJson, { status: 200 });
}
