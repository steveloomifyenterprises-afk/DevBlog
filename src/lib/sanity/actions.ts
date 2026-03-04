'use server';

import { writeClient } from './client';

export interface UpdateAuthorData {
  _id: string;
  name: string;
  email: string;
  bio?: string | null;
  image?: any;
  skills?: string[];
  github?: string | null;
  linkedin?: string | null;
  x?: string | null;
}

export async function updateAuthorProfile(data: UpdateAuthorData, userEmail: string) {
  // Security check: ensure the email in the document matches the logged-in user's email
  if (data.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error('Unauthorized: You can only update your own profile');
  }

  try {
    const result = await writeClient.patch(data._id)
      .set({
        name: data.name,
        bio: data.bio,
        image: data.image,
        skills: data.skills || [],
        github: data.github,
        linkedin: data.linkedin,
        x: data.x,
      })
      .commit();

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error updating author:', error);
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}

export async function createAuthorProfile(data: Omit<UpdateAuthorData, '_id'>, userEmail: string) {
  // Security check: ensure the email matches the logged-in user's email
  if (data.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error('Unauthorized: You can only create a profile for yourself');
  }

  try {
    const doc = {
      _type: 'author',
      name: data.name,
      email: data.email,
      bio: data.bio,
      image: data.image,
      skills: data.skills || [],
      github: data.github,
      linkedin: data.linkedin,
      x: data.x,
      slug: {
        current: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now(),
      },
    };

    const result = await writeClient.create(doc);

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error creating author:', error);
    return { success: false, error: error.message || 'Failed to create profile' };
  }
}