'use client';

import { useState } from 'react';
import { X, Loader2, User, Mail, Github, Linkedin, AtSign, Plus, Trash2 } from 'lucide-react';
import { updateAuthorProfile, createAuthorProfile } from '@/lib/sanity/actions';
import type { Author } from '@/types/sanity';

interface ProfileEditFormProps {
  author: Author | null;
  userEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ author, userEmail, onSuccess, onCancel }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: author?.name || '',
    bio: author?.bio || '',
    skills: author?.skills || [],
    github: author?.github || '',
    linkedin: author?.linkedin || '',
    x: author?.x || '',
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        name: formData.name,
        email: userEmail,
        bio: formData.bio || null,
        skills: formData.skills,
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        x: formData.x || null,
      };

      const result = author
        ? await updateAuthorProfile({ ...data, _id: author._id }, userEmail)
        : await createAuthorProfile(data, userEmail);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))] sticky top-0 bg-[hsl(var(--background))]">
          <h2 className="font-serif text-xl text-[hsl(var(--foreground))]">
            {author ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <button
            onClick={onCancel}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
              <input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--muted-foreground))] cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Contact admin to change email
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Social Links</h3>

            {/* GitHub */}
            <div>
              <label htmlFor="github" className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2">
                GitHub URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                <input
                  id="github"
                  name="github"
                  type="url"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            {/* X (Twitter) */}
            <div>
              <label htmlFor="x" className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2">
                X (Twitter) URL
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
                <input
                  id="x"
                  name="x"
                  type="url"
                  value={formData.x}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                  placeholder="https://x.com/username"
                />
              </div>
            </div>
          </div>

          {/* Image Note */}
          <div className="p-4 bg-[hsl(var(--muted))] rounded-lg">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              <strong>Note:</strong> Profile images can only be updated in Sanity Studio for security reasons.
              {author && ' Go to'}{' '}
              {author ? (
                <a href="/studio" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--foreground))] underline">
                  Sanity Studio
                </a>
              ) : (
                'the Studio after creating your profile'
              )}
              {' '}to upload or change your profile picture.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--border))]">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 border border-[hsl(var(--border))] rounded-lg font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[hsl(var(--foreground))] text-[hsl(var(--accent-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                author ? 'Update Profile' : 'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
