export default function Nav() {
  return (
    <nav>
      <div className="wrap">
        <div className="brand">
          <span className="dot" />
          varshith.dev
        </div>
        <div className="navlinks">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#stack">Stack</a>
        </div>
        <a href="#contact" className="navcta">
          Get in touch
        </a>
      </div>
    </nav>
  );
}
