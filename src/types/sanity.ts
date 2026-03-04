export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  crop?: {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
  };
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface Author {
  _id: string;
  _type: 'author';
  name?: string;
  slug?: Slug;
  email?: string;
  image?: SanityImage;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  x?: string;
}

export interface Category {
  _id: string;
  _type: 'category';
  title?: string;
  slug?: Slug;
  description?: string;
}

export interface Post {
  _id: string;
  _type: 'post';
  title?: string;
  slug?: Slug;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  author?: Author;
  categories?: Category[];
  content?: any; // Portable Text content
  readingTime?: number;
}
