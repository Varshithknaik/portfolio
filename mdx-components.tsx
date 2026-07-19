import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-5xl font-semibold leading-tight tracking-normal text-[var(--color-text)]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-3xl font-semibold tracking-normal text-[var(--color-text)]">
        {children}
      </h2>
    ),
    p: ({ children }) => <p className="mt-4 leading-7 text-muted">{children}</p>,
    a: ({ children, href }) => (
      <a className="text-accent underline-offset-4 hover:underline" href={href}>
        {children}
      </a>
    ),
    pre: ({ children }) => (
      <pre className="mt-5 overflow-x-auto rounded-ui border border-line bg-[#090b0f] p-5 text-sm">
        {children}
      </pre>
    ),
    code: ({ children }) => <code className="font-mono text-sm">{children}</code>,
    blockquote: ({ children }) => (
      <blockquote className="mt-5 rounded-ui border border-line bg-[var(--color-accent-soft)] p-5 text-muted">
        {children}
      </blockquote>
    ),
    ...components,
  };
}
