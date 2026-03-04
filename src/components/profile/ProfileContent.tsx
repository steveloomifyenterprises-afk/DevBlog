'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github, Linkedin, X, Mail, User, Edit, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { urlFor } from '@/lib/sanity/image';
import ProfileEditForm from './ProfileEditForm';
import type { Author } from '@/types/sanity';

interface ProfileContentProps {
  user: { email: string };
  author: Author | null;
  allAuthors: Author[];
  posts: any[];
}

export default function ProfileContent({ user, author, allAuthors, posts }: ProfileContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleProfileSuccess = () => {
    setIsEditing(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="w-full">
      {/* Edit Form Modal */}
      {isEditing && (
        <ProfileEditForm
          author={author}
          userEmail={user.email}
          onSuccess={handleProfileSuccess}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Header */}
      <section className="pt-16 pb-12 px-6 border-b border-[hsl(var(--border))]">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 link-muted text-sm mb-8"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2} />
            Back to home
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-4xl md:text-5xl text-[hsl(var(--foreground))]">
              Profile
            </h1>
            {author && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <Edit className="w-4 h-4" strokeWidth={1.5} />
                Edit
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          {!author ? (
            // No author profile exists
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                <User className="w-10 h-10 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-2xl text-[hsl(var(--foreground))] mb-3">
                No Profile Found
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">
                Create your profile to start publishing posts and connecting with readers.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Create Profile
              </button>

              {allAuthors && allAuthors.length > 0 && (
                <div className="mt-8 text-left bg-[hsl(var(--muted))] p-4 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                    <strong>Authors found in Sanity:</strong>
                  </p>
                  {allAuthors.map((a) => (
                    <div key={a._id} className="text-xs text-[hsl(var(--foreground))] mb-1 pb-1 border-b border-[hsl(var(--border))] last:border-0">
                      {a.name} - {a.email || '(no email)'}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-[hsl(var(--border))]">
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 border border-[hsl(var(--border))] rounded-lg font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors flex items-center gap-2 mx-auto"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            // Author profile exists
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
                {author.image && (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-[hsl(var(--border))]">
                    <img
                      src={urlFor(author.image).width(256).height(256).url()}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-serif text-3xl text-[hsl(var(--foreground))] mb-2">
                    {author.name}
                  </h2>
                  {author.email && (
                    <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-3">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm">{author.email}</span>
                    </div>
                  )}
                  {author.bio && (
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {author.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {author.skills && author.skills.length > 0 && (
                <div className="mb-12">
                  <h3 className="font-serif text-xl text-[hsl(var(--foreground))] mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {author.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 border border-[hsl(var(--border))] rounded-full text-sm text-[hsl(var(--muted-foreground))]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(author.github || author.linkedin || author.x) && (
                <div className="mb-12">
                  <h3 className="font-serif text-xl text-[hsl(var(--foreground))] mb-4">
                    Connect
                  </h3>
                  <div className="flex items-center gap-6">
                    {author.github && (
                      <a
                        href={author.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex items-center gap-2 text-[hsl(var(--foreground))] hover:opacity-70 transition-opacity"
                      >
                        <Github className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}
                    {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="flex items-center gap-2 text-[hsl(var(--foreground))] hover:opacity-70 transition-opacity"
                      >
                        <Linkedin className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    {author.x && (
                      <a
                        href={author.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        className="flex items-center gap-2 text-[hsl(var(--foreground))] hover:opacity-70 transition-opacity"
                      >
                        <X className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-sm">X</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* User's Posts */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-[hsl(var(--foreground))]">
                    Your Posts ({posts.length})
                  </h3>
                  {posts.length > 0 && (
                    <Link
                      href="/studio"
                      target="_blank"
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      Manage in Studio
                    </Link>
                  )}
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-8 border border-[hsl(var(--border))] rounded-lg">
                    <p className="text-[hsl(var(--muted-foreground))] mb-4">
                      You haven't published any posts yet.
                    </p>
                    <Link
                      href="/studio"
                      target="_blank"
                      className="inline-block px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Create Your First Post
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/posts/${post.slug?.current}`}
                        className="block p-4 border border-[hsl(var(--border))] rounded-lg hover:border-[hsl(var(--foreground))] transition-colors group"
                      >
                        <h4 className="font-serif text-lg text-[hsl(var(--foreground))] group-hover:opacity-70 transition-opacity">
                          {post.title}
                        </h4>
                        {post.excerpt && (
                          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="border-t border-[hsl(var(--border))] pt-8">
                <h3 className="font-serif text-xl text-[hsl(var(--foreground))] mb-4">
                  Account
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-2.5 border border-[hsl(var(--border))] rounded-lg font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
