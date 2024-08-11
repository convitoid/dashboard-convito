'use client';

import React from 'react';

type DataTablesComponentProps = {
    tableHead?: string[];
    children?: React.ReactNode;
};

export const DataTablesComponent = ({
    tableHead,
    children,
}: DataTablesComponentProps) => {
    return (
        <table className="border-[1px] w-full">
            <thead>
                <tr>
                    {tableHead?.map((head, index) => (
                        <th
                            key={index}
                            className="text-start py-2 px-4 bg-slate-400"
                        >
                            {head}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="border-[1px]">{children}</tbody>
        </table>
    );
};
