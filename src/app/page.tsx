import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TickerStrip from "@/components/TickerStrip";
import About from "@/components/About";
import Perks from "@/components/Perks";
import Events from "@/components/Events";
import Members from "@/components/Members";
import Projects from "@/components/Projects";
import JoinForm from "@/components/JoinForm";
import FAQ from "@/components/FAQ";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <main>
        <Hero />
        <TickerStrip />
        <About />
        <Perks />
        <Events />
        <Members />
        <Projects />
        <JoinForm />
        <FAQ />
        <Partners />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
