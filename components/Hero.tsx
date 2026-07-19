import { hero, shellModules } from "@/data/content";

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="eyebrow">{hero.eyebrow}</div>
        <h1>
          Ships frontend systems that scale <span className="accent">solo</span>.
        </h1>
        <p className="lede">{hero.lede}</p>
        <div className="herobtns">
          <a href="#projects" className="btn-primary">
            View work
          </a>
          <a href="#contact" className="btn-ghost">
            Resume &#8599;
          </a>
        </div>

        <div className="shell-diagram">
          <div className="shell-label">
            <span>module-federation.config.js</span>
            <span className="status">&#9679; live</span>
          </div>
          <div className="shell-core">
            <div className="core-box">
              App shell
              <span>webpack &middot; react 18</span>
            </div>
          </div>
          <div className="connectors" />
          <div className="modules-row">
            {shellModules.map((m) => (
              <div className="module-card" key={m.name}>
                <div className="name">{m.name}</div>
                <div className="tag">{m.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
