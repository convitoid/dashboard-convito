import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/libs/prisma';

interface JwtPayload {
   [key: string]: any;
}

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
   const token = params.token;

   if (!token) {
      return NextResponse.json({
         message: 'token not found',
      });
   }

   try {
      const decode = jwt.decode(token) as JwtPayload;

      const scenarioGuest = await prisma.guest.findFirst({
         select: {
            id: true,
            scenario_slug: true,
         },
         where: {
            id: Number(decode?.id),
         },
      });

      const guests = await prisma.guest.findFirst({
         select: {
            id: true,
            guestId: true,
            name: true,
            scenario_slug: true,
            clientId: true,
            client: {
               select: {
                  id: true,
                  client_id: true,
                  client_name: true,
                  event_name: true,
                  image: {
                     select: {
                        id: true,
                        clientId: true,
                        flag: true,
                        imagePath: true,
                        imageName: true,
                     },
                     where: {
                        flag: 'invitation_website',
                     },
                  },
                  Scenario: {
                     select: {
                        id: true,
                        scenario_name: true,
                        scenario_slug: true,
                        ScenarioQuestion: {
                           select: {
                              id: true,
                              question_id: true,
                              Question: {
                                 select: {
                                    id: true,
                                    question: true,
                                    type: true,
                                    position: true,
                                 },
                              },
                           },
                        },
                     },
                     where: {
                        scenario_slug: scenarioGuest?.scenario_slug,
                     },
                  },
               },
            },
            GuestDetail: {
               select: {
                  id: true,
                  detail_key: true,
                  detail_val: true,
               },
            },
         },
         where: {
            id: Number(decode?.id),
         },
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'Invitation data successfully retrieved',
            data: guests,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         {
            status: 404,
            message: 'token not found',
         },
         { status: 404 }
      );
   }
}
