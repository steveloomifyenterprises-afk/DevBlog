'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    slug: 'nextjs-16-features',
    title: 'Exploring Next.js 16: New Features and Best Practices',
    excerpt: 'Deep dive into the latest Next.js 16 features including React Compiler, Proxy.js, and enhanced performance optimizations.',
    coverImage: '/images/nextjs-16.jpg',
    publishedAt: '2026-01-15',
    author: {
      name: 'John Developer',
      avatar: '/images/avatar.jpg'
    },
    category: {
      name: 'Next.js',
      slug: 'nextjs',
      color: '#000000'
    },
    tags: ['Next.js', 'React', 'Web Development'],
    readingTime: 8
  },
  {
    id: '2',
    slug: 'threejs-react-integration',
    title: 'Building 3D Experiences with Three.js and React',
    excerpt: 'Learn how to create stunning 3D web experiences using Three.js with React Three Fiber and performance optimization techniques.',
    coverImage: '/images/threejs.jpg',
    publishedAt: '2026-01-12',
    author: {
      name: 'Jane Developer',
      avatar: '/images/avatar.jpg'
    },
    category: {
      name: '3D Graphics',
      slug: '3d-graphics',
      color: '#8b5cf6'
    },
    tags: ['Three.js', 'React', '3D', 'WebGL'],
    readingTime: 12
  },
  {
    id: '3',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Modern Applications',
    excerpt: 'Master complex TypeScript patterns and techniques for building type-safe, scalable applications in 2026.',
    coverImage: '/images/typescript.jpg',
    publishedAt: '2026-01-10',
    author: {
      name: 'Bob Developer',
      avatar: '/images/avatar.jpg'
    },
    category: {
      name: 'TypeScript',
      slug: 'typescript',
      color: '#3178c6'
    },
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    readingTime: 10
  }
];

export default function RecentPosts() {
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {post.category.name}
              </span>
            </div>
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span 
                className="px-3 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <Link href={`/posts/${post.slug}`}>
              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
            </Link>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min</span>
                </div>
              </div>
              
              <Link href={`/posts/${post.slug}`}>
                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}