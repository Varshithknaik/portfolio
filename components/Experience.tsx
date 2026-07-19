import { experience } from "@/data/content";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-title">Experience</span>
        </div>

        {experience.map((job) => (
          <div className="job" key={job.company}>
            <div className="job-meta">
              <div className="dates">{job.dates}</div>
              <div className="co">{job.company}</div>
              <div className="loc">{job.location}</div>
            </div>
            <div>
              <div className="job-role">{job.role}</div>
              <ul className="job-bullets">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="job-tags">
                {job.tags.map((t) => (
                  <span className="job-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
