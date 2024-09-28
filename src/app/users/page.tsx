// src/app/users/page.tsx
'use client';
import AppTable from '@/components/app.table';
import useSWR from 'swr';
import withAuth from '../hoc/withAuth';

const UsersPage = () => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const { data, error, isLoading } = useSWR('http://localhost:8000/users', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Failed to load data</div>;
    }

    return (
        <div className='mt-3'>
            <AppTable users={data?.sort((a: any, b: any) => b.id - a.id)} />
        </div>
    );
};

// Bảo vệ trang chỉ cho phép người dùng có vai trò 'admin' truy cập
export default withAuth(UsersPage, ['ADMIN']);
