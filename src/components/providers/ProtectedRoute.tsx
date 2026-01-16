'use client';

import { useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated and not on auth page, redirect
        if (!isAuthenticated && !token && pathname !== '/auth') {
            router.push('/auth');
        }

        // If authenticated and on auth page, redirect to home
        if (isAuthenticated && token && pathname === '/auth') {
            router.push('/');
        }
    }, [isAuthenticated, token, pathname, router]);

    // Optional: Add loading spinner while checking

    return <>{children}</>;
}
