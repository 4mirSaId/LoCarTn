// src/components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/isAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'agency' | 'client')[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

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