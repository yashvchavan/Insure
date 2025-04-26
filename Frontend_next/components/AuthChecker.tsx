// components/AuthChecker.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/context/store';

export default function AuthChecker() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok && data.authenticated) {
          login(data.user); // Update Zustand store
          if (window.location.pathname === '/user-login') {
            router.replace('/user-dashboard');
          }
        } else {
          if (window.location.pathname !== '/user-login') {
            router.replace('/user-login');
          }
        }
      } catch (error) {
        router.replace('/user-login');
      }
    }

    // Only verify if Zustand state doesn't match
    if (!isAuthenticated || !user) {
      verifyAuth();
    }
  }, [isAuthenticated, user, login, router]);

  return null;
}