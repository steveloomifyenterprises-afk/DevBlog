'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-3xl text-[hsl(var(--foreground))] mb-4">
          Sign In
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">
          Please sign in to access your profile
        </p>
        <AuthModal
          isOpen={true}
          onClose={() => router.push('/')}
        />
      </div>
    </div>
  );
}
