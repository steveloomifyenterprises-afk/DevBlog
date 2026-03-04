import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { client } from '@/lib/sanity/client';
import type { Post } from '@/types/sanity';

async function getAllPosts() {
  try {
    return await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      coverImage,
      "author": author->{
        _id,
        name,
        slug,
        image
      },
      "categories": categories[]->{
        _id,
        title,
        slug
      }
    }`);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-16 pb-12 px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 link-muted text-sm mb-8"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2} />
            Back to home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4">
            All Posts
          </h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl">
            Thoughts, tutorials, and insights on modern web development.
          </p>
        </div>
      </section>

      {/* Posts Feed */}
      <section className="border-t border-[hsl(var(--border))]">
        <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[hsl(var(--muted-foreground))]">
                No posts yet. Create your first post in{' '}
                <a href="/studio" className="text-[hsl(var(--foreground))] underline">
                  Sanity Studio
                </a>.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post: Post, index: number) => (
                <article
                  key={post._id}
                  className={`group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 py-8 ${
                    index < posts.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''
                  }`}
                >
                  {/* Date */}
                  {post.publishedAt && (
                    <time
                      className="sm:text-sm text-[hsl(var(--muted-foreground))] tabular-nums whitespace-nowrap"
                      dateTime={post.publishedAt}
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  )}

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/posts/${post.slug?.current}`}
                      className="block group/link"
                    >
                      <h2 className="font-serif text-xl md:text-2xl text-[hsl(var(--foreground))] mb-2 group-hover/link:opacity-70 transition-opacity duration-200">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
