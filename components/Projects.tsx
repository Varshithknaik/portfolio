import { projects } from "@/data/content";

export default function Projects() {
  return (
    <section id="projects">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <span className="sec-title">Projects</span>
        </div>
        <div className="proj-grid">
          {projects.map((p) => {
            const card = (
              <div className="proj-card" key={p.title}>
                <div className="proj-top">
                  <span className="proj-tag">{p.tag}</span>
                  <span
                    className={`proj-status${p.status === "Live" ? " live" : ""}`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.description}</div>
                <div className="proj-stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            );
            return p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                key={p.title}
                style={{ display: "block" }}
              >
                {card}
              </a>
            ) : (
              card
            );
          })}
        </div>
      </div>
    </section>
  );
}
