import { Metadata } from "next";
import { profile, hero, about, experience, projects, stack, education } from "@/data/content";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume | Varshith K",
  description: "Varshith K's Professional Resume.",
};

export default function ResumePage() {
  return (
    <div className="wrap" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ marginBottom: '8px', fontSize: '42px' }}>{profile.name}</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)' }}>
            <span>{profile.phone}</span> | <span>{profile.email}</span> | <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/varshith-k-76b644172</a>
          </div>
        </div>
        <a href="/varshith_k_resume.pdf" download className="navcta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} />
          Download PDF
        </a>
      </div>

      <section style={{ padding: '0', borderBottom: 'none', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Professional Summary</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{hero.lede}</p>
        {about.paragraphs.map((p, i) => (
          <p key={i} style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '12px' }}>{p}</p>
        ))}
      </section>

      <section style={{ padding: '0', borderBottom: 'none', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Professional Experience</h2>
        {experience.map((job) => (
          <div key={job.company} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{job.company} | <span style={{ fontWeight: 400 }}>{job.role}</span></h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-dim)' }}>{job.dates}, {job.location}</span>
            </div>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
              {job.bullets.map((b, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section style={{ padding: '0', borderBottom: 'none', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Key Products</h2>
        {projects.map((p) => (
          <div key={p.title} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{p.title} | <span style={{ fontWeight: 400 }}>{p.stack.join(', ')}</span></h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
              {p.bullets?.map((b, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section style={{ padding: '0', borderBottom: 'none', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Skills</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div><strong style={{ color: 'var(--text-main)' }}>Languages:</strong> {stack.languages.join(', ')}</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Frontend:</strong> {stack.frontend.join(', ')}</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Architecture:</strong> {stack.architecture.join(', ')}</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Backend:</strong> {stack.backend.join(', ')}</div>
          <div><strong style={{ color: 'var(--text-main)' }}>Tools:</strong> {stack.tooling.join(', ')}</div>
        </div>
      </section>

      <section style={{ padding: '0', borderBottom: 'none', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Education</h2>
        {education.map((edu) => (
          <div key={edu.degree} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{edu.institution}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{edu.degree}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-dim)' }}>{edu.dates}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
