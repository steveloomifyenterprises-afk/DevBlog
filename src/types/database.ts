// Database schema for Modern Developer Blog
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  authorId: string;
  categoryId?: string;
  tags: string[];
  readingTime: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  id: string;
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  postId: string;
  views: number;
  readTime: number;
  date: Date;
}