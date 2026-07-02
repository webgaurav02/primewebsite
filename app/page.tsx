import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import WhatPrimeDoes from "@/components/sections/WhatPrimeDoes";
import Stats from "@/components/sections/Stats";
import EntrepreneursOfPrime from "@/components/sections/EntrepreneursOfPrime";
import Gallery from "@/components/sections/Gallery";
import FAQ from "@/components/sections/FAQ";
import Partners from "@/components/sections/Partners";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <WhatPrimeDoes />
        <Stats />
        <EntrepreneursOfPrime />
        <Gallery />
        <FAQ />
        <Partners />
      </main>
      <Footer />
    </>
  );
}
