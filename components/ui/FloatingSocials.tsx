"use client";

import { useState } from "react";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/primemeghalaya",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/primemeghalaya",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@primemeghalaya",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/primemeghalaya",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/primemeghalaya",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function FloatingSocials() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed left-4 bottom-24 z-40 flex flex-col items-center gap-2 hidden md:flex">
      {/* Vertical label */}
      <div
        className="mb-1 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
        title="Social media"
      >
        <span
          className="block text-black/20 hover:text-[#2D6A4F] font-bold tracking-[0.28em] uppercase transition-colors duration-200 select-none"
          style={{ writingMode: "vertical-rl", fontSize: "8px" }}
        >
          Follow
        </span>
        <span className="block w-px h-8 bg-black/10 mx-auto mt-1.5" />
      </div>

      {/* Social icons */}
      {socials.map((s, i) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="w-8 h-8 flex items-center justify-center text-black/25 hover:text-[#1B4332] hover:bg-[#74C69D]/20 transition-all duration-200"
          style={{
            opacity: expanded ? 1 : i === 0 ? 1 : 0,
            transform: expanded ? "none" : i === 0 ? "none" : "translateY(4px)",
            pointerEvents: expanded || i === 0 ? "auto" : "none",
            transition: `opacity 0.2s ease ${i * 0.04}s, transform 0.2s ease ${i * 0.04}s, color 0.15s, background 0.15s`,
          }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
