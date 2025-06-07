// src/components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/features/redux/hooks';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'agency' | 'client')[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && !allowedRoles.includes(user?.role as 'admin' | 'agency' | 'client')) {
      router.push('/');
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role as 'admin' | 'agency' | 'client'))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;