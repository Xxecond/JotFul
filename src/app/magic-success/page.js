// app/magic-success/page.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from "@/components/ui";
// Force dynamic rendering – fixes the build error
export const dynamic = 'force-dynamic';

export default function MagicSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      router.push('/auth/signup'); // or your login/signup page
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      // Save to storage manually
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Go to your main app page
      router.push('/home'); // change to your actual protected page
    } catch (err) {
      router.push('/auth/signup');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="mt-4 text-lg">Logging you in...</p>
    </div>
  );
}