import { about } from "@/data/content";

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <span className="sec-title">About</span>
        </div>
        <div className="about-grid">
          <div className="about-text">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="focus-list">
            {about.focusList.map((f) => (
              <div className="focus-item" key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
