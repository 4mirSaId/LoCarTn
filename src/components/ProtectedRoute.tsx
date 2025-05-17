// src/components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/isAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'AGENCY' | 'CLIENT')[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && !allowedRoles.includes(user?.role as 'ADMIN' | 'AGENCY' | 'CLIENT')) {
      router.push('/');
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role as 'ADMIN' | 'AGENCY' | 'CLIENT'))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;