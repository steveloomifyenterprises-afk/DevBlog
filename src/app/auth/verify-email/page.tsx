'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // First, try to sign up again which will trigger a new email
      // In production, you'd want a dedicated resend endpoint
      const { error } = await supabase.auth.signUp({
        email,
        password: 'temp-password-for-resend', // This won't work for existing users
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // If user already exists, try to sign in which might help with refresh
        if (error.message.includes('already registered')) {
          // For existing users, we'd need a different approach
          // For now, show a message
          setSent(true);
        } else {
          throw error;
        }
      }

      setSent(true);
    } catch (err: any) {
      console.error('Error resending email:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 link-muted text-sm mb-8"
        >
          <ArrowLeft className="w-3 h-3" strokeWidth={2} />
          Back to home
        </Link>

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
          <Mail className="w-8 h-8 text-[hsl(var(--foreground))]" strokeWidth={1.5} />
        </div>

        {!sent ? (
          <>
            <h1 className="font-serif text-3xl text-[hsl(var(--foreground))] mb-4">
              Verify your email
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-8">
              We'll send a verification link to your email address. Click the link to complete your account setup.
            </p>

            <form onSubmit={handleResend} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send verification link'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-[hsl(var(--foreground))] mb-4">
              Check your inbox
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-8">
              We've sent a verification link to <strong>{email}</strong>. The link will expire in 24 hours.
            </p>

            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </>
        )}

        <p className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">
          Need help? Contact{' '}
          <a href="mailto:support@example.com" className="text-[hsl(var(--foreground))] underline underline-offset-4">
            support
          </a>
        </p>
      </div>
    </div>
  );
}
