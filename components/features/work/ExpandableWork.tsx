"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { featuredWork } from "@/lib/site";

export function ExpandableWork() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-4">
      {featuredWork.map((work, index) => {
        const isActive = active === index;

        return (
          <button
            key={work.title}
            className="surface-card w-full p-0 text-left transition hover:border-[var(--color-line-strong)]"
            onClick={() => setActive(isActive ? -1 : index)}
            type="button"
          >
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
              <div>
                <p className="section-kicker">{work.eyebrow}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-normal text-[var(--color-text)]">
                  {work.title}
                </h3>
              </div>
              <div>
                <p className="text-sm leading-6 text-muted md:text-base">{work.summary}</p>
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-5 border-t border-line pt-5 text-sm leading-6 text-muted">
                        {work.details}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {work.stack.map((item) => (
                          <span className="chip" key={item}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
