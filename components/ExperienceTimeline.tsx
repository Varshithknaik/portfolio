"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experience } from "@/lib/site";
import { cn } from "@/lib/utils";

const groups = ["responsibilities", "architecture", "challenges", "lessons"] as const;

export function ExperienceTimeline() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-5">
      {experience.map((job, index) => {
        const isActive = active === index;

        return (
          <article className="surface-card" key={job.company}>
            <button
              className="flex w-full items-start justify-between gap-6 p-6 text-left md:p-8"
              type="button"
              onClick={() => setActive(isActive ? -1 : index)}
            >
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <div>
                  <p className="font-mono text-xs text-subtle">{job.period}</p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-normal">
                    {job.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{job.role}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{job.scope}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={cn("mt-1 shrink-0 text-accent transition", isActive && "rotate-180")}
                size={18}
              />
            </button>
            <AnimatePresence initial={false}>
              {isActive ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 border-t border-line p-6 md:grid-cols-2 md:p-8">
                    {groups.map((group) => (
                      <div className="rounded-ui border border-line bg-[var(--color-bg)] p-5" key={group}>
                        <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                          {group.replace("-", " ")}
                        </h3>
                        <ul className="mt-4 grid gap-3">
                          {job[group].map((item) => (
                            <li className="text-sm leading-6 text-muted" key={item}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
