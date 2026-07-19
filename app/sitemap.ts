import type { MetadataRoute } from "next";
import { caseStudies, navigation, notes, projects } from "@/lib/site";

const baseUrl = "https://varshith.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/contact", "/blog", ...navigation.map((item) => item.href)];
  const noteRoutes = notes.map((note) => `/notes/${note.slug}`);
  const caseStudyRoutes = caseStudies.flatMap((study) => [
    `/case-studies/${study.slug}`,
    `/case-studies/${study.slug}/demo`,
  ]);
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

  return [...staticRoutes, ...noteRoutes, ...caseStudyRoutes, ...projectRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
