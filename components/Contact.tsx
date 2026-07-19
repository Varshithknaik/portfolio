import { profile, contact } from "@/data/content";

export default function Contact() {
  return (
    <>
      <section id="contact" style={{ borderBottom: "none" }}>
        <div className="wrap contact">
          <div className="sec-title" style={{ fontSize: 36, marginBottom: 16 }}>
            {contact.heading}
          </div>
          <p>{contact.sub}</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              Email me
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              GitHub &#8599;
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn &#8599;
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </>
  );
}
