import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  stega: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
    studioUrl: '/studio',
  },
});

// Write client with token for server-side mutations
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function getPosts() {
  return await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
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
}

export async function getPost(slug: string) {
  return await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    content,
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
}

export async function getCategories() {
  return await client.fetch(`*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`);
}

export async function getPostsByCategory(categorySlug: string) {
  return await client.fetch(`*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
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
  }`, { categorySlug });
}

export async function getAuthorByEmail(email: string) {
  return await client.fetch(`*[_type == "author" && lower(email) == lower($email)][0] {
    _id,
    name,
    slug,
    email,
    image,
    bio,
    skills,
    github,
    linkedin,
    x
  }`, { email });
}

// Debug function to see all authors
export async function getAllAuthors() {
  return await client.fetch(`*[_type == "author"] {
    _id,
    name,
    slug,
    email,
    image,
    bio,
    skills,
    github,
    linkedin,
    x
  }`);
}

export async function getAuthorPosts(authorSlug: string) {
  return await client.fetch(`*[_type == "post" && author->slug.current == $authorSlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage
  }`, { authorSlug });
}
