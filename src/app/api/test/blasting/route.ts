import { sendMessage } from "@/services/testBlastingService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    access_token,
    test_phone_number,
    target_phone_number,
    event_name,
    sender,
    invitation_link,
  } = await req.json();

  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  const response = await sendMessage(
    jwtToken as string,
    access_token,
    target_phone_number,
    event_name,
    sender,
    invitation_link
  );

  //   const token = req.headers.get("authorization");
  //   const jwtToken = token?.split(" ")[1];
  //   const response = await sendMessage(jwtToken as string, authToken, "to");
  //   console.log("dari api", response);
  //   return NextResponse.json(response, { status: 200 });
  return NextResponse.json(response, { status: 200 });
}
