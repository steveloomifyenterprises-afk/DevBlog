import Link from 'next/link';
import { Github, Linkedin, X } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: 'https://github.com',
      label: 'GitHub',
      icon: Github,
    },
    {
      href: 'https://linkedin.com',
      label: 'LinkedIn',
      icon: Linkedin,
    },
    {
      href: 'https://x.com',
      label: 'X',
      icon: X,
    },
  ];

  return (
    <footer className="border-t border-[hsl(var(--border))] mt-auto">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © {currentYear} DevBlog. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
