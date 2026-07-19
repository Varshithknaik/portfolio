import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Varshith K",
  description: "Work history and professional experience.",
};

export default function ExperiencePage() {
  return (
    <>
      <div style={{ paddingTop: '40px' }}>
        <Experience />
      </div>
      <Contact />
    </>
  );
}
