'use client'
import AppTable from '@/components/app.table';

import useSWR from 'swr'


const UsersPage = () => {
    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const { data, error, isLoading } = useSWR('http://localhost:8000/users', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    if (isLoading) {
        return <div>loading...</div>;
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

export default UsersPage;
