'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav>
      <div className="wrap">
        <Link href="/" className="brand">
          <span className="dot" />
          Varshith K
        </Link>
        <div className="navlinks">
          <Link href="/">Home</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/projects">Projects</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="navcta"
            style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}
            aria-label="Toggle Dark Mode"
          >
            {mounted ? (
              theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />
            ) : (
              <div style={{ width: 18, height: 18 }} />
            )}
          </button>
          <Link href="/contact" className="navcta">
            Get in touch
          </Link>
        </div>
      </div>
    </nav>
  );
}
