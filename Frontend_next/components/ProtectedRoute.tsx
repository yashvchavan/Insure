// components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/context/store';

export default function ProtectedRoute({ 
  children,
  requiredRole = 'user'
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== requiredRole)) {
      router.push(requiredRole === 'admin' ? '/admin-login' : '/login');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated || (user && user.role !== requiredRole)) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}