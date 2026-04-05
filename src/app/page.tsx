import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import WaveDivider from "@/components/wave-divider";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ferri Yusra",
  url: "https://ferriyusra.com",
  jobTitle: "Full Stack Engineer",
  description:
    "Backend engineer with 4+ years building scalable API systems across fintech, GovTech health, and automotive industries.",
  sameAs: [
    "https://github.com/ferriyusra",
    "https://linkedin.com/in/ferriyusra",
  ],
};

export default function Home() {
  return (
    <main className="dot-grid min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
