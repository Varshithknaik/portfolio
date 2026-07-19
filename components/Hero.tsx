import { hero } from "@/data/content";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 60%)',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: '50%'
        }}
      />
      
      <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div 
          className="eyebrow" 
          style={{ 
            justifyContent: 'center', 
            marginBottom: '24px',
            background: 'var(--bg-panel)',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid var(--border)',
            display: 'inline-flex'
          }}
        >
          {hero.eyebrow}
        </div>
        
        <h1 style={{ maxWidth: '800px', margin: '0 auto 32px', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.1 }}>
          {hero.headline[0]} <br/>
          <span 
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {hero.headline[1]}
          </span>
          <br/>
          {hero.headline[2]}{hero.headline[3]}
        </h1>
        
        <p className="lede" style={{ margin: '0 auto 48px', fontSize: '18px', maxWidth: '640px' }}>
          {hero.lede}
        </p>
        
        <div className="herobtns" style={{ justifyContent: 'center' }}>
          <Link href="/projects" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '14px' }}>
            View projects
            <ArrowRight size={16} />
          </Link>
          <Link href="/resume" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '14px' }}>
            <FileText size={16} />
            View resume
          </Link>
        </div>
      </div>
    </header>
  );
}
