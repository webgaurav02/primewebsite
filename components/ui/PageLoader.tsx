"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [barWidth, setBarWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("prime-loaded")) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setBarWidth(eased * 100);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("prime-loaded", "1");
        }, 220);
      }
    };

    const id = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 150);

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
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center select-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          aria-hidden="true"
        >
          {/* PRIME logo */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="mb-10"
          >
            <Image
              src="/logo-white.png"
              alt="PRIME Meghalaya"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </motion.div>

          {/* Thin progress bar */}
          <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#9EC84A]"
              style={{ width: `${barWidth}%`, transition: "none" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-4 text-[9px] text-white/30 tracking-[0.35em] uppercase font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Government of Meghalaya
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
