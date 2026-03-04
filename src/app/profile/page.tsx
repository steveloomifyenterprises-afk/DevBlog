import { createClient } from '@/lib/supabase/server';
import { getAllAuthors, getAuthorByEmail, getAuthorPosts } from '@/lib/sanity/client';
import { redirect } from 'next/navigation';
import type { Author } from '@/types/sanity';
import ProfileContent from '@/components/profile/ProfileContent';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch author from Sanity by email
  const allAuthors = await getAllAuthors();
  const author = await getAuthorByEmail(user.email!) as Author | null;
  const posts = author ? await getAuthorPosts(author.slug?.current || '') : [];

  return (
    <ProfileContent
      user={{ email: user.email! }}
      author={author}
      allAuthors={allAuthors}
      posts={posts}
    />
  );
}
