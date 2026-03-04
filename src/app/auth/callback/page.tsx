'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient();

      // Handle the email confirmation redirect
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      if (data.session) {
        setStatus('success');
        setMessage('Email verified successfully!');

        // Redirect after a delay
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Could not verify email. Please try again.');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[hsl(var(--foreground))] animate-spin" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
              Verifying your email...
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
              {message}
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Redirecting you to your profile...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
              Verification Failed
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {message}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
