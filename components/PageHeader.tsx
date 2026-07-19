import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  kicker: string;
  title: string;
  copy?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  headingClassName?: string;
  titleClassName?: string;
  copyClassName?: string;
};

export function PageHeader({
  kicker,
  title,
  copy,
  actions,
  footer,
  children,
  className,
  headingClassName,
  titleClassName,
  copyClassName,
}: PageHeaderProps) {
  return (
    <section className={cn("site-container py-20 md:py-28", className)}>
      <div
        className={cn(
          actions && "grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end",
        )}
      >
        <div className={cn("max-w-3xl", headingClassName)}>
          <p className="section-kicker">{kicker}</p>
          <h1 className={cn("section-title", titleClassName)}>{title}</h1>
          {copy ? <p className={cn("section-copy", copyClassName)}>{copy}</p> : null}
          {footer ? <div className="mt-10 flex flex-wrap gap-3">{footer}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
