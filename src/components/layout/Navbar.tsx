'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, User, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isLoading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Posts' },
    { href: '/profile', label: 'Profile' },
  ];

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) {
      return user?.email?.[0]?.toUpperCase() || 'U';
    }
    const name = user.user_metadata.full_name;
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-xl font-medium text-[hsl(var(--foreground))] hover:opacity-70 transition-opacity"
            >
              DevBlog
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-muted text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {mounted && (
                  <>
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Moon className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </>
                )}
                {!mounted && (
                  <div className="w-4 h-4" />
                )}
              </button>

              {/* Auth Section */}
              {!isLoading && mounted && (
                <>
                  {!user ? (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))] hover:opacity-70 transition-opacity"
                      >
                        <div className="w-7 h-7 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-medium">
                          {getUserInitials()}
                        </div>
                      </button>

                      {/* User Dropdown */}
                      {userMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-lg py-1 z-20">
                            <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                              <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                                {user.user_metadata?.full_name || 'User'}
                              </p>
                              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                                {user.email}
                              </p>
                            </div>
                            <Link
                              href="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] flex items-center gap-2 transition-colors"
                            >
                              <UserCircle className="w-4 h-4" strokeWidth={1.5} />
                              View Profile
                            </Link>
                            <button
                              onClick={async () => {
                                setUserMenuOpen(false);
                                await signOut();
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] flex items-center gap-2 transition-colors"
                            >
                              <LogOut className="w-4 h-4" strokeWidth={1.5} />
                              Sign Out
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="link-muted text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
