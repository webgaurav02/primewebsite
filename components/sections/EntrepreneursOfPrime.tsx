"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimateIn from "@/components/ui/AnimateIn";

const entrepreneurs = [
  { name: "Emika Mawlong",           sector: "Rural Enterprise",     img: "/assets/entrepreneurs/Emika-Mawlong.jpg"          },
  { name: "Bryan Daoba D. Shira",    sector: "Government & Startup", img: "/assets/entrepreneurs/Bryan-Daoba-D-Shira.jpg"    },
  { name: "Anikit R. Marak",         sector: "District Coordinator", img: "/assets/entrepreneurs/Anikit-R-Marak.jpg"         },
  { name: "Priyana Marak",           sector: "Business Facilitation",img: "/assets/entrepreneurs/Priyana-Marak.jpg"           },
  { name: "Mark Altroge CH. Marak",  sector: "Media & Comms",        img: "/assets/entrepreneurs/Mark-Altroge-CH-Marak.jpg"  },
  { name: "Andrew Tshering Bareh",   sector: "Communications",       img: "/assets/entrepreneurs/Andrew.jpg"                 },
];

export default function EntrepreneursOfPrime() {
  return (
    <section className="bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimateIn direction="left">
            <p className="text-[11px] text-[#9EC84A] font-semibold tracking-[0.25em] uppercase mb-3">The People</p>
            <h2
              className="font-black text-white leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
            >
              Entrepreneurs<br />
              <span className="text-[#9EC84A]">of Prime.</span>
            </h2>
          </AnimateIn>
          <AnimateIn direction="right" delay={0.1}>
            <p className="text-[13px] text-white/60 max-w-xs leading-relaxed">
              Real people. Real businesses. Powered by PRIME across every district of&nbsp;Meghalaya.
            </p>
          </AnimateIn>
        </div>
      </div>

      {/* Full-bleed photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 max-w-7xl mx-auto px-6 lg:px-10">
        {entrepreneurs.map((e, i) => (
          <AnimateIn key={e.name} delay={i * 0.07} direction="up">
            <motion.div
              className="relative overflow-hidden group aspect-[3/4]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Image
                src={e.img}
                alt={e.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Content reveal */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <p className="text-[10px] text-[#9EC84A] font-bold uppercase tracking-widest mb-1">{e.sector}</p>
                <p className="text-white font-bold text-[14px] leading-tight">{e.name}</p>
              </div>

              {/* Green corner accent */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#9EC84A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
