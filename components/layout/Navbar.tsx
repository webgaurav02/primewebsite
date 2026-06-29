"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/", dropdown: null },
  {
    label: "About Us",
    href: "/about-us",
    dropdown: [
      { label: "About PRIME",        href: "/about-us"          },
      { label: "Our Team",           href: "/team"              },
      { label: "PRIME Overview",     href: "/about-us#overview" },
      { label: "Friends & Partners", href: "/about-us#partners" },
    ],
  },
  {
    label: "Sector",
    href: "#",
    dropdown: [
      { label: "Incubation",            href: "/incubation"            },
      { label: "Market Linkage",        href: "/market-linkage"        },
      { label: "Business Facilitation", href: "/business-facilitation" },
      { label: "Training Centres",      href: "/trainingcentres"       },
      { label: "Fellowship",            href: "/fellowship"            },
    ],
  },
  {
    label: "Funding & Schemes",
    href: "/funding-schemes",
    dropdown: [
      { label: "All Schemes",                href: "/funding-schemes"                },
      { label: "CM Elevate",                 href: "/cm-elevate"                     },
      { label: "PRIME Entrepreneurship Fund",href: "/prime-entrepreneurship-funding" },
      { label: "IFAD GAP Funding",           href: "/ifad-gap-funding"               },
      { label: "Student Tinkering Fund",     href: "/student-tinkering-fund"         },
    ],
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled]       = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-white/[0.06]"
          : "bg-[#0a0a0a] border-transparent"
      }`}
      role="banner"
    >
      {/* ── Main bar ── */}
      <div
        ref={navRef}
        className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center h-[64px]"
      >

        {/* Col 1 — Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="PRIME Meghalaya"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Col 2 — Nav links (centered) */}
        <ul className="hidden md:flex items-center justify-center gap-7" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <li key={link.label} className="relative">
              {link.dropdown ? (
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === link.label ? null : link.label)
                  }
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                  className="text-white/60 hover:text-white text-[12px] flex items-center gap-1.5 transition-colors py-1"
                >
                  {link.label}
                  <motion.span
                    animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#9EC84A] opacity-70"
                  >
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.span>
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-white text-[12px] transition-colors"
                >
                  {link.label}
                </Link>
              )}

              {link.dropdown && openDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-60 bg-[#111] border border-white/10 rounded-sm shadow-2xl py-1.5 z-50"
                  role="menu"
                  aria-label={`${link.label} submenu`}
                >
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-white/65 hover:text-white hover:bg-white/5 transition-colors group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#9EC84A] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </li>
          ))}
        </ul>

        {/* Col 3 — CTA + mobile toggle */}
        <div className="flex items-center gap-3 justify-end">
          <Link
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            rel="noopener noreferrer"
            data-lpignore="true"
            data-form-type="other"
            className="hidden md:inline-flex group relative px-5 py-2 bg-[#9EC84A] text-black text-[12px] font-bold overflow-hidden rounded-sm"
          >
            <span className="relative z-10">Portal Access</span>
            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
          </Link>

          <button
            className="md:hidden text-white/80 hover:text-white p-1 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}  className="block h-px bg-current" />
              <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}                        className="block h-px bg-current" />
              <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} className="block h-px bg-current" />
            </div>
          </button>
        </div>

      </div>

      {/* ── Mobile menu ── */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden bg-[#0d0d0d] border-t border-white/[0.08]"
        aria-hidden={!menuOpen}
      >
        <div className="px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href === "#" ? "/" : link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-white/75 hover:text-white text-sm font-medium border-b border-white/5"
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="pl-4 pt-1 pb-2 flex flex-col gap-0.5">
                  {link.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-white/60 hover:text-[#9EC84A] text-[12px] transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="https://portal.primemeghalaya.com/GeneralRegistraion.php"
            target="_blank"
            className="mt-3 px-4 py-3 bg-[#9EC84A] text-black text-sm font-bold text-center rounded-sm"
          >
            Portal Access
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
