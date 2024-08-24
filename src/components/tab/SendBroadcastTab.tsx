import { fetchGuests } from '@/app/GlobalRedux/Thunk/guests/guestThunk';
import { AppDispatch, RootState } from '@/app/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type SendBroadcastTabProps = {
   clientId?: string;
};

export const SendBroadcastTab = ({ clientId }: SendBroadcastTabProps) => {
    const [columns, setColumns] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
       pageIndex: 0,
       pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState('');


   const dispatch = useDispatch<AppDispatch>();
   const guest = useSelector((state: RootState) => state.guests.guests);

   useEffect(() => {
      dispatch(fetchGuests(clientId?.toString() ?? ''));
   }, [dispatch]);

   console.log('guest', guest);

   return (
      <>
         <h1 className="text-lg font-semibold">Broadcast Data</h1>
      </>
   );
};
