import React from 'react';
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  // Return a simple loading state while redirecting
  return <div>Redirecting to dashboard...</div>;
}