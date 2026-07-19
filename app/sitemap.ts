import type { MetadataRoute } from "next";
import { caseStudies, navigation, notes, projects } from "@/lib/site";

const baseUrl = "https://varshith.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/contact", "/blog", ...navigation.map((item) => item.href)];
  const noteRoutes = notes.map((note) => `/notes/${note.slug}`);
  const caseStudyRoutes = caseStudies.map((study) => `/case-studies#${study.slug}`);
  const projectRoutes = projects.map((project) => `/projects#${project.title.toLowerCase().replaceAll(" ", "-")}`);

  return [...staticRoutes, ...noteRoutes, ...caseStudyRoutes, ...projectRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
