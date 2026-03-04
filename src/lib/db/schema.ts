// Database connection and schema for Modern Developer Blog
// This is a simplified schema that can be implemented with Prisma, Drizzle, or any ORM

// import { sql } from '@vercel/postgres'; // Uncomment when using Vercel Postgres

// Database types
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

// SQL Schema (for PostgreSQL)
export const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    subscribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    tags TEXT[] DEFAULT '{}',
    reading_time INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_analytics_post_date ON analytics(post_id, date);
`;

// Database utility functions (example implementation)
// Uncomment when using actual database connection
/*
export class Database {
  // Users
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await sql`
      INSERT INTO users (email, name, avatar, subscribed)
      VALUES (${userData.email}, ${userData.name}, ${userData.avatar}, ${userData.subscribed})
      RETURNING *
    `;
    return result.rows[0] as User;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result.rows[0] as User || null;
  }

  // Posts
  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const result = await sql`
      INSERT INTO posts (slug, title, excerpt, content, cover_image, published, author_id, category_id, tags, reading_time, published_at)
      VALUES (${postData.slug}, ${postData.title}, ${postData.excerpt}, ${postData.content}, ${postData.coverImage}, ${postData.published}, ${postData.authorId}, ${postData.categoryId}, ${postData.tags}, ${postData.readingTime}, ${postData.publishedAt})
      RETURNING *
    `;
    return result.rows[0] as Post;
  }

  static async getPublishedPosts(limit = 10, offset = 0): Promise<Post[]> {
    const result = await sql`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar, c.name as category_name, c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.published = true AND p.published_at <= NOW()
      ORDER BY p.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result.rows as Post[];
  }

  static async getPostBySlug(slug: string): Promise<Post | null> {
    const result = await sql`
      SELECT p.*, u.name as author_name, u.avatar as author_avatar, c.name as category_name, c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug} AND p.published = true
    `;
    return result.rows[0] as Post || null;
  }

  // Categories
  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const result = await sql`
      INSERT INTO categories (name, slug, description, color)
      VALUES (${categoryData.name}, ${categoryData.slug}, ${categoryData.description}, ${categoryData.color})
      RETURNING *
    `;
    return result.rows[0] as Category;
  }

  static async getAllCategories(): Promise<Category[]> {
    const result = await sql`SELECT * FROM categories ORDER BY name`;
    return result.rows as Category[];
  }

  // Newsletter
  static async subscribeToNewsletter(email: string): Promise<Newsletter> {
    const result = await sql`
      INSERT INTO newsletter (email, active)
      VALUES (${email}, true)
      ON CONFLICT (email) DO UPDATE SET active = true, updated_at = NOW()
      RETURNING *
    `;
    return result.rows[0] as Newsletter;
  }

  static async unsubscribeFromNewsletter(email: string): Promise<Newsletter> {
    const result = await sql`
      UPDATE newsletter SET active = false, updated_at = NOW()
      WHERE email = ${email}
      RETURNING *
    `;
    return result.rows[0] as Newsletter;
  }

  // Analytics
  static async trackPostView(postId: string): Promise<void> {
    await sql`
      INSERT INTO analytics (post_id, views, date)
      VALUES (${postId}, 1, CURRENT_DATE)
      ON CONFLICT (post_id, date) DO UPDATE SET views = analytics.views + 1
    `;
  }

  static async getPostAnalytics(postId: string): Promise<Analytics[]> {
    const result = await sql`
      SELECT * FROM analytics WHERE post_id = ${postId} ORDER BY date DESC
    `;
    return result.rows as Analytics[];
  }
}
*/

// Default data for seeding
export const seedData = {
  categories: [
    { name: 'Next.js', slug: 'nextjs', description: 'Posts about Next.js framework', color: '#000000' },
    { name: 'React', slug: 'react', description: 'React development tips and tricks', color: '#61dafb' },
    { name: 'TypeScript', slug: 'typescript', description: 'TypeScript best practices', color: '#3178c6' },
    { name: 'Three.js', slug: 'threejs', description: '3D graphics and WebGL', color: '#000000' },
    { name: 'CSS', slug: 'css', description: 'CSS techniques and animations', color: '#1572b6' },
  ],
  
  posts: [
    {
      slug: 'nextjs-16-features',
      title: 'Exploring Next.js 16: New Features and Best Practices',
      excerpt: 'Deep dive into the latest Next.js 16 features including React Compiler, Proxy.js, and enhanced performance optimizations.',
      content: '# Next.js 16 Features\n\nNext.js 16 brings exciting new features...',
      published: true,
      tags: ['Next.js', 'React', 'Performance'],
      readingTime: 8,
      publishedAt: new Date('2026-01-15'),
    },
    {
      slug: 'threejs-react-integration',
      title: 'Building 3D Experiences with Three.js and React',
      excerpt: 'Learn how to create stunning 3D web experiences using Three.js with React Three Fiber.',
      content: '# Three.js with React\n\nCreating 3D experiences in the browser...',
      published: true,
      tags: ['Three.js', 'React', '3D', 'WebGL'],
      readingTime: 12,
      publishedAt: new Date('2026-01-12'),
    },
  ],
};