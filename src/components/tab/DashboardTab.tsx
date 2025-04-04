import {
    exportData,
    filterDataByAnswer,
    filterDataGlobal,
    getDashboardData,
} from '@/app/GlobalRedux/Thunk/clients/clientDashboardThunk';
import {AppDispatch, RootState} from '@/app/store';
import {convertStatus} from '@/utils/convertStatus';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {exportToExcel} from '../../utils/exportToExcel';
import {ChevronDoubleLeftIcon} from '../icons/chevronDoubleLeft';
import {ChevronDoubleRightIcon} from '../icons/chevronDoubleRight';
import {ChevronLeftIcon} from '../icons/chevronLeft';
import {ChevronRightIcon} from '../icons/chevronRight';
import {ExcelIcon} from '../icons/excel';

type DashboardTabProps = {
    clientId: string;
};

export const DashboardTab: React.FC<DashboardTabProps> = ({clientId}) => {
    const [columns, setColumns] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [url, setUrl] = useState('');
    const [isCopy, setIsCopy] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const dashboarData = useSelector((state: RootState) => state.clientDashboard.datas);
    const status = useSelector((state: RootState) => state.clientDashboard.status);
    const totalGuests = useSelector((state: RootState) => state.clientDashboard.totalGuests);
    const answeredGuests = useSelector((state: RootState) => state.clientDashboard.answeredGuests);
    const notAnsweredGuests = useSelector((state: RootState) => state.clientDashboard.notAnsweredGuests);
    const guestConfirm = useSelector((state: RootState) => state.clientDashboard.guestConfirm);
    const guestDecline = useSelector((state: RootState) => state.clientDashboard.guestDecline);


    useEffect(() => {
        dispatch(getDashboardData({clientId: clientId?.toString()}));
    }, [dispatch]);

    useEffect(() => {
        if (isCopy) {
            setTimeout(() => {
                setIsCopy(false);
            }, 1000);
        }
    }, [isCopy]);

    useEffect(() => {
        const dynamicColumns = [
            {
                header: 'No',
                accessorKey: 'no',
                cell: (info: any) => info.row.index + 1,
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Scenario',
                accessorKey: 'scenario',
            },
            {
                header: 'Answer',
                accessorKey: 'answer',
            },
            {
                header: 'Invitation URL',
                accessorKey: 'invitationUrl',
                cell: (info: any) => {
                    const invitationLink = `${process.env.NEXT_PUBLIC_API_URL}/invitation/${info.row.original.invitationUrl}`;
                    return info?.row?.original?.invitationUrl !== '' ? (
                        <CopyToClipboard text={invitationLink} onCopy={() => setIsCopy(true)}>
                            <button
                                className="bg-blue-500 text-white cursor-pointer px-2 py-2 rounded-md hover:bg-blue-600 focus:bg-blue-500 tooltip tooltip-bottom"
                                data-tip="Copy URL to clipboard"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
                                        clipRule="evenodd"
                                    />
                                    <path
                                        d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z"/>
                                </svg>
                            </button>
                        </CopyToClipboard>
                    ) : (
                        <span className="text-red-500"> - </span>
                    );
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info: any) => {
                    return (
                        <span
                            className={`px-3 py-1 text-[13px] uppercase rounded-md font-semibold ${info.row.original.status === 'NOT SENT YET' ? 'bg-amber-400' : info.row.original.status === 'FAILED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                     {info.row.original.status === 'FAILED'
                         ? `Failed: ${info.row.original.statusCode}`
                         : info.row.original.status}
                  </span>
                    );
                },
            },
            {
                header: 'Last Updated',
                accessorKey: 'lastUpdate',
                cell: (info: any) => {
                    return (
                        <span className="text-[14px]">
                     {info.row.original.lastUpdate ? info.row.original.lastUpdate : '-'}
                  </span>
                    );
                },
            },
        ];

        setColumns(dynamicColumns);

        if (dashboarData?.length > 0) {
            const dynamicData = dashboarData[0]?.guest?.map((item: any, index: number) => {
                const webhookStatus = item?.webhook?.length > 0 ? item.webhook[0] : null;
                const statusCode = item?.webhook?.length > 0 ? item.webhook[0].statusCode : null;
                const lastUpdate = item?.webhook?.length > 0 ? item.webhook[0].lastUpdateStatus : null;

                const answer = item?.Invitations.filter((invitation: any) => invitation.Question.position === 1);

                const status = convertStatus(webhookStatus?.status);

                return {
                    id: item.id,
                    name: item.name,
                    scenario: item.scenario,
                    answer:
                        answer.map((ans: any) => ans.answer)[0] === 'yes'
                            ? 'Yes'
                            : answer.map((ans: any) => ans.answer)[0] === 'no'
                                ? 'No'
                                : ' - ',
                    status: status,
                    statusCode: statusCode,
                    lastUpdate: lastUpdate ? moment(lastUpdate).format('DD/MM/YYYY HH:mm:ss') : null,
                    invitationUrl: item?.Invitations?.length > 0 ? item?.Invitations[0]?.token : '',
                };
            });

            setData(dynamicData);
        }
    }, [dashboarData]);

    const searchChange = (e: any) => {
        setGlobalFilter(e.target.value);

        dispatch(
            filterDataGlobal({
                clientId: clientId?.toString(),
                search_by: '',
                is_answer: selectedFilter,
                value: e.target.value,
            })
        )
            .unwrap()
            .then((res) => {
                if (res.status === 200) {
                    const dynamicData = res.data?.map((item: any, index: number) => {
                  
                        // const answer = item.Invitations.some((invitation: any) => invitation.answer !== null);
                        const webhookStatus = item.webhook.length > 0 ? item.webhook[0] : null;
                        const statusCode = item.webhook.length > 0 ? item.webhook[0].statusCode : null;
                        const lastUpdate = item.webhook.length > 0 ? item.webhook[0].lastUpdateStatus : null;

                        const status = convertStatus(webhookStatus?.status);

                        const answer = item?.Invitations.filter((invitation: any) => invitation.Question.position === 1);

                        return {
                            id: item.id,
                            name: item.name,
                            scenario: item.scenario,
                            answer:
                                answer.map((ans: any) => ans.answer)[0] === 'yes'
                                    ? 'Yes'
                                    : answer.map((ans: any) => ans.answer)[0] === 'no'
                                        ? 'No'
                                        : ' - ',
                            status: status,
                            statusCode: statusCode,
                            lastUpdate: lastUpdate ? moment(lastUpdate).format('DD/MM/YYYY HH:mm:ss') : null,
                            invitationUrl: item?.Invitations?.length > 0 ? item?.Invitations[0]?.token : '',
                        };
                    });


                    setData(dynamicData);
                } else {
                    setData([]);
                }
            });
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    const handleFilterDataBySelected = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedScenario = e.target.value;
        if (selectedScenario === 'all') {
            dispatch(getDashboardData({clientId: clientId?.toString()})).then((res) => {
                if (res.payload) {
                    const dynamicData = res.payload.data[0].guest.map((item: any, index: number) => {
                        // const answer = item.Invitations.some((invitation: any) => invitation.answer !== null);
                        const webhookStatus = item.webhook.length > 0 ? item.webhook[0] : null;
                        const statusCode = item.webhook.length > 0 ? item.webhook[0].statusCode : null;
                        const lastUpdate = item.webhook.length > 0 ? item.webhook[0].lastUpdateStatus : null;

                        const status = convertStatus(webhookStatus?.status);

                        const answer = item?.Invitations.filter((invitation: any) => invitation.Question.position === 1);

                        return {
                            id: item.id,
                            name: item.name,
                            scenario: item.scenario,
                            answer:
                                answer.map((ans: any) => ans.answer)[0] === 'yes'
                                    ? 'Yes'
                                    : answer.map((ans: any) => ans.answer)[0] === 'no'
                                        ? 'No'
                                        : ' - ',
                            status: status,
                            statusCode: statusCode,
                            lastUpdate: lastUpdate ? moment(lastUpdate).format('DD/MM/YYYY HH:mm:ss') : null,
                            invitationUrl: item?.Invitations?.length > 0 ? item?.Invitations[0]?.token : '',
                        };
                    });

                    setData(dynamicData);
                }
            });

            setGlobalFilter('');
            setSelectedFilter('');
        } else {
            setGlobalFilter('');
            setSelectedFilter(selectedScenario);

            dispatch(
                filterDataByAnswer({
                    clientId: clientId?.toString(),
                    search_by: 'answered_question',
                    value: selectedScenario,
                })
            )
                .unwrap()
                .then((res) => {
                    if (res.status === 200) {
                        const dynamicData = res.data.map((item: any, index: number) => {
                            // const answer = item.Invitations.some((invitation: any) => invitation.answer !== null);
                            const webhookStatus = item.webhook.length > 0 ? item.webhook[0] : null;
                            const statusCode = item.webhook.length > 0 ? item.webhook[0].statusCode : null;
                            const lastUpdate = item.webhook.length > 0 ? item.webhook[0].lastUpdateStatus : null;

                            const status = convertStatus(webhookStatus?.status);

                            const answer = item?.Invitations.filter((invitation: any) => invitation?.Question?.position === 1);

                            return {
                                id: item.id,
                                name: item.name,
                                scenario: item.scenario,
                                answer:
                                    answer.map((ans: any) => ans.answer)[0] === 'yes'
                                        ? 'Yes'
                                        : answer.map((ans: any) => ans.answer)[0] === 'no'
                                            ? 'No'
                                            : ' - ',
                                status: status,
                                statusCode: statusCode,
                                lastUpdate: lastUpdate ? moment(lastUpdate).format('DD/MM/YYYY HH:mm:ss') : null,
                                invitationUrl: item?.Invitations?.length > 0 ? item?.Invitations[0]?.token : '',
                            };
                        });

                        setData(dynamicData);
                    } else {
                        setData([]);
                    }
                });
        }
    };

    useEffect(() => {
        const filter = table.getRowModel().rows.map((row) => row.original.id);
        setFilteredData(filter);
    }, [selectedFilter]);

    const handleExportToExcel = () => {
        dispatch(exportData({clientId: clientId?.toString(), filter_by: selectedFilter}))
            .unwrap()
            .then((res) => {
                if (res.status === 200) {
                    exportToExcel(res.data, clientId?.toString());
                }
            });
    };

    return (
        <div>
            <div className="grid grid-cols-3 3md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-14">
                <div className="bg-sky-500 p-4 rounded-md text-white mb-4">
                    <h2 className="text-3xl font-semibold">{dashboarData?.length > 0 ? totalGuests : 0}</h2>
                    <h4 className="text-md font-semibold">Total Guest(s)</h4>
                </div>
                <div className="bg-green-500 p-4 rounded-md text-white mb-4">
                    <h2 className="text-3xl font-semibold">{dashboarData?.length > 0 ? answeredGuests : 0}</h2>
                    <h4 className="text-md font-semibold">Total Answered</h4>
                </div>
                <div className="bg-amber-500 p-4 rounded-md text-white mb-4">
                    <h2 className="text-3xl font-semibold">{dashboarData?.length > 0 ? notAnsweredGuests : 0}</h2>
                    <h4 className="text-md font-semibold">Total Unanswered</h4>
                </div>
                <div className="bg-teal-500 p-4 rounded-md text-white mb-4">
                    <h2 className="text-3xl font-semibold">{dashboarData?.length > 0 ? guestConfirm : 0}</h2>
                    <h4 className="text-md font-semibold">Guest(s) Confirmed</h4>
                </div>
                <div className="bg-red-500 p-4 rounded-md text-white mb-4">
                    <h2 className="text-3xl font-semibold">{dashboarData?.length > 0 ? guestDecline : 0}</h2>
                    <h4 className="text-md font-semibold">Guest(s) Decline</h4>
                </div>
            </div>
            <div className="flex justify-between mb-3">
                <h2 className="text-lg font-bold">Guest Data</h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm">Filter data : </span>
                    <select
                        name="filter_data"
                        id="filter_data"
                        onChange={handleFilterDataBySelected}
                        className="select select-sm select-bordered"
                        value={selectedFilter || 'all'}
                    >
                        <option value="" disabled>
                            Filtered answer
                        </option>
                        <option value="all">All</option>
                        <option value="yes">Answered</option>
                        <option value="no">Not Answered</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search"
                        className="border-[1px] px-3 py-1 rounded-md"
                        value={globalFilter}
                        onChange={searchChange}
                    />
                    <button
                        className="bg-white hover:bg-slate-50 transition duration-100 ease-in p-[0.30rem] border-[1px] rounded-md tooltip tooltip-left"
                        data-tip="Export to Excel"
                        onClick={handleExportToExcel}
                    >
                        {status === 'exportLoading' ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <ExcelIcon height="1.3em" width="1.3em"/>
                        )}
                    </button>
                </div>
            </div>
            <table className="border-[1px] w-full">
                <thead className="uppercase">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}
                                    className="text-start h-10 px-4 py-2 bg-[#1c1c1c] text-white text-sm">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {data?.length > 0 ? (
                        status === 'loading' ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-2 ">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Loading</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2 border-b-[1px] border-slate-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )
                    ) : status === 'loading' ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-2 ">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span> <span>Loading</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-2 text-center">
                                No data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <select
                        className="border-[1px] border-slate-900 px-3 py-2 rounded-md bg-transparent"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    <span className="flex items-center gap-1">
                  | Go to page:
                  <input
                      type="number"
                      min="1"
                      max={table?.getPageCount()}
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                          const page = e.target.value ? Number(e.target.value) - 1 : 0;
                          table.setPageIndex(page);
                      }}
                      className="border p-1 rounded w-16"
                  />
               </span>
                </div>
                <div className="text-[13px]">
                    <p>
                        Showing <span className="font-semibold">{table.getRowModel().rows.length}</span> Of{' '}
                        <span className="font-semibold">{data?.length}</span> Entries
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-3 rounded-md transition duration-100 ease-in `}
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronDoubleLeftIcon className="size-3"/>
                    </button>
                    <button
                        className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-4 py-3 rounded-md transition duration-100 ease-in `}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon className="size-3"/>
                    </button>
                    <span className="flex items-center gap-1 mx-4 text-sm">
                  <div>Page</div>
                  <strong>
                     {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                  </strong>
               </span>
                    <button
                        className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-4 py-3 rounded-md transition duration-100 ease-in `}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon className="size-3"/>
                    </button>
                    <button
                        className={`btn border-[1px] border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-3 rounded-md transition duration-100 ease-in `}
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronDoubleRightIcon className="size-3"/>
                    </button>
                </div>
            </div>

            {isCopy && (
                <div className="toast">
                    <div className="alert alert-info text-white">
                        <span>Link copied to clipboard</span>
                    </div>
                </div>
            )}
        </div>
    );
};
