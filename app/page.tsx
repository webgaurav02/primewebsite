import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import WhatPrimeDoes from "@/components/sections/WhatPrimeDoes";
import EntrepreneursOfPrime from "@/components/sections/EntrepreneursOfPrime";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <Stats />
        <WhatPrimeDoes />
        <EntrepreneursOfPrime />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
