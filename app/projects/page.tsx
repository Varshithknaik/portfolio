import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Varshith K",
  description: "Enterprise products and projects I've built.",
};

export default function ProjectsPage() {
  return (
    <>
      <div style={{ paddingTop: '40px' }}>
        <Projects />
      </div>
      <Contact />
    </>
  );
}
