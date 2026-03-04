import type { PortableTextComponents } from '@portabletext/react';

export const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 text-base md:text-lg leading-relaxed text-[hsl(var(--foreground))]">{children}</p>,
    h1: ({ children }) => <h1 className="font-serif text-3xl md:text-4xl mt-12 mb-6 text-[hsl(var(--foreground))]">{children}</h1>,
    h2: ({ children }) => <h2 className="font-serif text-2xl md:text-3xl mt-12 mb-6 text-[hsl(var(--foreground))]">{children}</h2>,
    h3: ({ children }) => <h3 className="font-serif text-xl md:text-2xl mt-10 mb-5 text-[hsl(var(--foreground))]">{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => <code className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
    link: ({ children, value }: any) => (
      <a
        href={value?.href || '#'}
        className="text-[hsl(var(--foreground))] underline decoration-[hsl(var(--border))] underline-offset-4 hover:decoration-[hsl(var(--foreground))] transition-colors"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="ml-6 mb-6 space-y-3 list-disc">{children}</ul>,
    number: ({ children }) => <ol className="ml-6 mb-6 space-y-3 list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed text-[hsl(var(--foreground))]">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed text-[hsl(var(--foreground))]">{children}</li>,
  },
  hardBreak: () => <br />,
};
