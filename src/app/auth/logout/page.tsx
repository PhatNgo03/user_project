// src/app/auth/logout/page.tsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem('user');
        router.push('/auth/login');
    }, [router]);

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
};

export default LogoutPage;
