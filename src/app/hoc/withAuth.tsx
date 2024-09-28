// src/hoc/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    role: string;
};

const withAuth = <T extends object>(WrappedComponent: React.ComponentType<T>, allowedRoles: string[]) => {
    const AuthComponent = (props: T) => {
        const router = useRouter();
        const user: User | null = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

        useEffect(() => {
            if (!user || !allowedRoles.includes(user.role)) {
                router.push('/auth/login');
            }
        }, [user, allowedRoles, router]);

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
