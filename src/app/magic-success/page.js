// app/magic-success/page.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/authContext' ;
import { Spinner } from "@/components/ui";

export default function MagicSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleMagicCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      router.push('/auth/login'); // or your signup page
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      // Persist manually (in case handleMagicCallback fails)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard/app
      router.push('/dashboard'); // change to your main app page
    } catch (err) {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="mt-4 text-lg">Logging you in...</p>
    </div>
  );
}