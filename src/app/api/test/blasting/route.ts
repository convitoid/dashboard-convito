import prisma from '@/libs/prisma';
import {
    createLogs,
    createQuestion,
    getLogs,
    sendMessage,
} from '@/services/testBlastingService';
import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const {
        access_token,
        target_phone_number,
        event_name,
        sender,
        guest_name,
        invitation_link,
    } = await req.json();

    const token = req.headers.get('authorization');
    const jwtToken = token?.split(' ')[1];

    try {
        const logs = await prisma.logTestMessage.findMany({
            orderBy: {
                id: 'desc',
            },
        });

        console.log('logs', logs.length === 0);

        let newClientId;
        let invitationLink;
        if (logs.length === 0) {
            newClientId = 'CL-0001';
            invitationLink = `${invitation_link}/${newClientId}`;
        } else {
            const lastData = logs[0].clientId.split('-')[1];
            const increment = parseInt(lastData, 10) + 1;
            newClientId = `CL-${increment.toString().padStart(4, '0')}`;
            invitationLink = `${invitation_link}/${newClientId}`;
        }

        const questionData = [
            {
                question:
                    '<p>Please confirm your attendance, <strong>YES</strong> (joyfully accept), <strong>NO</strong> (regretfully decline)</p>',
                type: 'radio',
                flag: 'confirm_question',
                position: 1,
            },
            {
                question:
                    '<p>This invitation is valid for <strong>2 Guest(s)</strong>, how many guest will attend?</p>',
                type: 'number',
                flag: 'normal_question',
                position: 2,
            },
            {
                question:
                    '<p>Are any guest vegetarian? (Optional) Example: Bambang - Vegetarian / Adeline Vegetarian</p>',
                type: 'text',
                flag: 'normal_question',
                position: 3,
            },
            {
                question:
                    '<p>You are also invited in <strong>The Holy Matrimony of Mr. Convito & Ms. Convito</strong> for <strong>2 Guest(s)</strong>, how many guest will attend?</p>',
                type: 'number',
                flag: 'normal_question',
                position: 4,
            },
        ];

        const response = await sendMessage(
            jwtToken as string,
            access_token,
            target_phone_number,
            guest_name,
            invitationLink
        );

        if (response?.error?.code === 190) {
            console.log('masuk error', response);
            return NextResponse.json(response, { status: 400 });
        } else {
            await createLogs(
                jwtToken as string,
                target_phone_number,
                guest_name,
                event_name,
                sender,
                invitation_link,
                newClientId
            );

            const getLogs = await prisma.logTestMessage.findMany();
            const lastId = getLogs[getLogs.length - 1].id;

            questionData.map(async (question) => {
                await createQuestion(
                    jwtToken as string,
                    question.question,
                    lastId.toString(),
                    question.type,
                    question.flag,
                    question.position
                );
            });
        }

        return NextResponse.json('', { status: 200 });
    } catch (error) {
        console.log('error', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');
    const jwtToken = token?.split(' ')[1];
    try {
        const response = await getLogs(jwtToken as string);
        return NextResponse.json(response, { status: response.status });
    } catch (error) {}
    return NextResponse.json({ message: 'Hello' });
}
