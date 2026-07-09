"use client";

import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const socials = [
  { label: "Facebook",  href: "https://www.facebook.com/primemeghalaya/",                  Icon: FaFacebook,   color: "#1877F2" },
  { label: "Instagram", href: "https://www.instagram.com/primemeghalaya/",                 Icon: FaInstagram,  color: "#E1306C" },
  { label: "LinkedIn",  href: "https://in.linkedin.com/company/prime-startup-meghalaya",   Icon: FaLinkedinIn, color: "#0A66C2" },
  { label: "YouTube",   href: "https://www.youtube.com/channel/UCqVwccQWXyVIc-v6lg_0nbw", Icon: FaYoutube,    color: "#FF0000" },
];

export default function SocialFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 left-6 z-[9999] bg-white border border-black/[0.1] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1B4332]">
            <p className="font-black text-white" style={{ fontSize: "11px" }}>Follow PRIME</p>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white p-0.5 transition-colors"
              aria-label="Close social panel"
            >
              <HiX size={14} />
            </button>
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {socials.map(({ label, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 border border-black/[0.07] hover:border-black/20 transition-all duration-150 group"
                aria-label={label}
              >
                <span
                  className="w-7 h-7 flex items-center justify-center shrink-0 transition-colors duration-150"
                  style={{ color }}
                >
                  <Icon size={15} />
                </span>
                <span className="font-semibold text-black/60 group-hover:text-black transition-colors duration-150" style={{ fontSize: "11px" }}>
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle social media links"
        aria-expanded={open}
        className={`fixed bottom-6 left-6 z-[9999] w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 ${
          open ? "bg-[#74C69D] text-[#1B4332]" : "bg-[#1B4332] text-white hover:bg-[#2D6A4F]"
        }`}
      >
        {open ? (
          <HiX size={20} />
        ) : (
          /* Share / social icon */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="18" cy="5"  r="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="6"  cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
            <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}
