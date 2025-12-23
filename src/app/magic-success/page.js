'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from "@/components/ui";

export const dynamic = 'force-dynamic';

function MagicSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      router.push('/auth/signup');
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/home');
    } catch {
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

export default function MagicSuccess() {
  return (
    <Suspense fallback={<Spinner size="lg" />}>
      <MagicSuccessContent />
    </Suspense>
  );
}
