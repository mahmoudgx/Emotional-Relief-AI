'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

  // Redirect to home page
  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-xl">Redirecting to home page...</div>
    </div>
  );
}
