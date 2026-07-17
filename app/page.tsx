import { Hero, Marquee, Work, About, Services, Testimonial, Contact } from "@/components/Sections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="wrap">
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Services />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
