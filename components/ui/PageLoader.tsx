"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PageLoader() {
  const [visible, setVisible]   = useState(true);
  const [barWidth, setBarWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("prime-loaded")) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    const start    = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3);
      setBarWidth(eased * 100);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("prime-loaded", "1");
        }, 240);
      }
    };

    const id = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 120);

    return () => {
      clearTimeout(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="prime-loader"
          className="fixed inset-0 z-[9999] bg-[#1B4332] flex flex-col items-center justify-center select-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden="true"
        >
          {/* PRIME logo — glowing pulse */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12"
          >
            <Image
              src="/logo-white.png"
              alt="PRIME Meghalaya"
              width={200}
              height={60}
              className="h-12 w-auto object-contain animate-prime-glow"
              priority
            />
          </motion.div>

          {/* Progress bar */}
          <div className="w-32 h-px bg-white/[0.12] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#74C69D]"
              style={{ width: `${barWidth}%`, transition: "none" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-5 tracking-[0.35em] uppercase font-semibold text-[#74C69D]/50"
            style={{ fontSize: "9px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Government of Meghalaya
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
