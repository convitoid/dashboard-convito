'use client';
import { BreadcrumbsComponent } from '@/components/breadcrumbs';
import { useEffect } from 'react';

const breadcrumbsData = [
    {
        name: 'dashboard',
        href: '/dashboard',
    },
    {
        name: 'customers',
        href: '/dashboard/customers',
    },
    {
        name: 'customer detail',
        href: '',
    },
];

const CustomerDetailPage = ({ params }: { params: { slug: string } }) => {
    useEffect(() => {
        document.title = 'Convito - Customers Detail';
    }, []);
    return (
        <div>
            <div className="flex justify-end mb-3">
                <BreadcrumbsComponent data={breadcrumbsData} />
            </div>
            <h1>Customer Detail Page</h1>
        </div>
    );
};

export default CustomerDetailPage;
