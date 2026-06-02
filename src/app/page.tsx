import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import TickerStrip   from "@/components/TickerStrip";
import About         from "@/components/About";
import Perks         from "@/components/Perks";
import Timeline      from "@/components/Timeline";
import Testimonials  from "@/components/Testimonials";
import Events        from "@/components/Events";
import PastEvents    from "@/components/PastEvents";
import Members       from "@/components/Members";
import Team          from "@/components/Team";
import OpenRoles     from "@/components/OpenRoles";
import Projects      from "@/components/Projects";
import JoinForm      from "@/components/JoinForm";
import FAQ           from "@/components/FAQ";
import Partners      from "@/components/Partners";
import Contact       from "@/components/Contact";
import Footer        from "@/components/Footer";
import SmoothScroll  from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop   from "@/components/ScrollToTop";
import CommandPalette from "@/components/CommandPalette";
import Cursor        from "@/components/Cursor";
import Intro         from "@/components/Intro";

export default function Home() {
  return (
    <>
      <Intro />
      <Cursor />
      <SmoothScroll>
        <ScrollProgress />
        <ScrollToTop />
        <CommandPalette />
        <Navbar />
        <main>
          <Hero />
          <TickerStrip />
          <About />
          <Perks />
          <Timeline />
          <Testimonials />
          <Events />
          <PastEvents />
          <Members />
          <Team />
          <OpenRoles />
          <Projects />
          <JoinForm />
          <FAQ />
          <Partners />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
