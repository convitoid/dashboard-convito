'use client';

import { fetchInvitation } from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import NotFound from '@/app/not-found';
import { AppDispatch, RootState } from '@/app/store';
import { InvitationHome } from '@/components/page/invitationHome';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const GuestTestingPage = ({ params }: { params: { invitation: string } }) => {
    const router = useRouter();

    const clientId = params.invitation[0];
    const dispatch = useDispatch<AppDispatch>();
    const invitations = useSelector(
        (state: RootState) => state.testBlasting.invitation
    );

    const status = useSelector((state: RootState) => state.testBlasting.status);

    if (invitations?.status === 404) {
        // return
        router.push('/404');
    }

    useEffect(() => {
        dispatch(fetchInvitation(clientId));
    }, [clientId, dispatch]);

    useEffect(() => {
        document.title = 'Convito - Reservations wedding and event';
    }, []);

    return (
        <div className="relative z-10">
            <div className="flex justify-center mb-3">
                {status === 'loading' || status === 'idle' ? (
                    <div className="flex flex-col justify-center items-center h-screen">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <InvitationHome invitations={invitations} />
                )}
            </div>
        </div>
    );
};

export default GuestTestingPage;
