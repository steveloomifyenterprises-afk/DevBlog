import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { client } from '@/lib/sanity/client';
import type { Post, Category } from '@/types/sanity';
import { PortableText } from '@portabletext/react';
import { components } from '@/components/blog/PortableText';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  try {
    return await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      coverImage,
      content,
      readingTime,
      "author": author->{
        _id,
        name,
        slug,
        image,
        bio
      },
      "categories": categories[]->{
        _id,
        title,
        slug
      }
    }`, { slug });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Article */}
      <article className="w-full">
        {/* Header */}
        <header className="pt-16 pb-12 px-6 border-b border-[hsl(var(--border))]">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 link-muted text-sm mb-8"
            >
              <ArrowLeft className="w-3 h-3" strokeWidth={2} />
              All posts
            </Link>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category: Category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug?.current}`}
                    className="px-3 py-1 border border-[hsl(var(--border))] rounded-full text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))] transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--foreground))] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              )}
              {post.author?.name && (
                <>
                  <span>·</span>
                  <span>{post.author.name}</span>
                </>
              )}
              {post.readingTime && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {post.readingTime} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-12">
          {post.content ? (
            <div className="prose">
              <PortableText
                value={post.content}
                components={components}
              />
            </div>
          ) : (
            <p className="text-[hsl(var(--muted-foreground))]">No content available.</p>
          )}
        </div>
      </article>
    </div>
  );
}

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))] {
      "slug": slug.current
    }`);

    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}
