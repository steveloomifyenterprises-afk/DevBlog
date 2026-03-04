'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

type AuthMode = 'signin' | 'signup';
type AuthView = 'form' | 'verify' | 'success';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [view, setView] = useState<AuthView>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setView('form');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required
        setView('verify');
      } else if (data.session) {
        setView('success');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        onClose();
        resetForm();
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <h2 className="font-serif text-xl text-[hsl(var(--foreground))]">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'form' && (
            <>
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6 p-1 bg-[hsl(var(--muted))] rounded-lg">
                <button
                  onClick={() => switchMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === 'signin'
                      ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                      : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === 'signup'
                      ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                      : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>
            </>
          )}

          {view === 'verify' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                <Mail className="w-8 h-8 text-[hsl(var(--foreground))]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
                Check your email
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
              </p>
              <button
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
                Welcome!
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                Your account has been created successfully. You're now signed in.
              </p>
              <button
                onClick={() => {
                  onClose();
                  resetForm();
                  router.push('/profile');
                }}
                className="px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Continue to Profile
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {view === 'form' && (
          <div className="p-6 border-t border-[hsl(var(--border))] text-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-[hsl(var(--foreground))] underline underline-offset-4">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[hsl(var(--foreground))] underline underline-offset-4">
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
