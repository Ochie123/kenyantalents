// AuthGuard.tsx
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/loading-screen';

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if the token exists in cookies
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      
      if (!token) {
        // If no token, redirect to login
        router.replace('/login');
      } else {
        // If token exists, you might want to verify it here
        // For now, we'll just assume it's valid
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    // Not authenticated, but this should not be rendered as we're redirecting
    return null;
  }

  // Authenticated, render children
  return <>{children}</>;
}