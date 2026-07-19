import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export type MarkdownHeading = {
  id: string;
  text: string;
  depth: 1 | 2 | 3;
};

const allowedUrlProtocols = new Set(["http:", "https:", "mailto:"]);

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stripMdxMetadata(source: string) {
  return source.replace(/^export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};\s*/m, "").trim();
}

export function extractMarkdownHeadings(source: string): MarkdownHeading[] {
  return source
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      depth: match[1].length as 1 | 2 | 3,
      text: match[2].trim(),
      id: slugifyHeading(match[2]),
    }))
    .filter((heading) => heading.depth === 2 || heading.depth === 3);
}

function isSafeUrl(value?: string) {
  if (!value) {
    return false;
  }

  if (value.startsWith("/") || value.startsWith("#")) {
    return true;
  }

  try {
    return allowedUrlProtocols.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

function getText(children: unknown): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(getText).join("");
  }

  return "";
}

function highlightCode(value: string) {
  const tokens = value.split(
    /(\b(?:const|let|type|return|max|floor|indexOf|min|number|string)\b|[(){}[\]]|=>|->|[+\-*/=])/g,
  );

  return tokens.map((token, index) => {
    if (/^\b(?:const|let|type|return)\b$/.test(token)) {
      return (
        <span className="text-[#ffcc66]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    if (/^\b(?:max|floor|indexOf|min)\b$/.test(token)) {
      return (
        <span className="text-[#82aaff]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    if (/^\b(?:number|string)\b$/.test(token)) {
      return (
        <span className="text-[#c3e88d]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    if (/^[(){}[\]]$/.test(token)) {
      return (
        <span className="text-[#89ddff]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    if (/^(=>|->|[+\-*/=])$/.test(token)) {
      return (
        <span className="text-[#c792ea]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    if (/^\d+$/.test(token)) {
      return (
        <span className="text-[#f78c6c]" key={`${token}-${index}`}>
          {token}
        </span>
      );
    }

    return token;
  });
}

const markdownComponents: Components = {
  h1({ children }) {
    const text = getText(children);
    return (
      <h1
        className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.96] tracking-normal"
        id={slugifyHeading(text)}
      >
        {children}
      </h1>
    );
  },
  h2({ children }) {
    const text = getText(children);
    return (
      <h2
        className="scroll-mt-24 pt-7 font-display text-3xl font-semibold tracking-normal"
        id={slugifyHeading(text)}
      >
        {children}
      </h2>
    );
  },
  h3({ children }) {
    const text = getText(children);
    return (
      <h3
        className="scroll-mt-24 pt-4 font-display text-xl font-semibold tracking-normal"
        id={slugifyHeading(text)}
      >
        {children}
      </h3>
    );
  },
  p({ children }) {
    return <p className="text-base leading-8 text-muted">{children}</p>;
  },
  ul({ children }) {
    return (
      <ul className="grid list-disc gap-2 pl-5">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="grid list-decimal gap-2 pl-5">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="pl-1 text-sm leading-7 text-muted">{children}</li>;
  },
  a({ children, href }) {
    if (!isSafeUrl(href)) {
      return <>{children}</>;
    }

    const className = "text-accent underline-offset-4 hover:underline";

    if (href?.startsWith("/")) {
      return (
        <Link className={className} href={href}>
          {children}
        </Link>
      );
    }

    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target={href?.startsWith("#") || href?.startsWith("mailto:") ? undefined : "_blank"}
      >
        {children}
      </a>
    );
  },
  img({ alt, src }) {
    if (!isSafeUrl(src)) {
      return null;
    }

    return (
      <img
        alt={alt ?? ""}
        className="my-6 rounded-ui border border-line"
        loading="lazy"
        src={src}
      />
    );
  },
  code({ children, className }) {
    const isBlock = className?.startsWith("language-");
    const code = String(children).replace(/\n$/, "");

    if (isBlock) {
      return (
        <code className="block font-mono text-sm leading-7 text-[#d7deea]">
          {highlightCode(code)}
        </code>
      );
    }

    return (
      <code className="rounded border border-line bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-text)]">
        {children}
      </code>
    );
  },
  pre({ children }) {
    return (
      <pre className="overflow-x-auto rounded-ui border border-[#243044] bg-[#090d14] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        {children}
      </pre>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="rounded-ui border border-line bg-[var(--color-accent-soft)] px-5 py-4 text-muted">
        {children}
      </blockquote>
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto rounded-ui border border-line">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border-b border-line bg-panel px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.08em] text-accent">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="border-b border-line px-4 py-3 text-muted">{children}</td>;
  },
};

export function SafeMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-6">
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
