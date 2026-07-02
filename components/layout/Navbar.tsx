"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type MegaItem = {
  label: string;
  subtitle?: string;
  href: string;
  img?: string;
  external?: boolean;
};

type MegaColumn = {
  heading: string;
  items: MegaItem[];
};

type NavLink = {
  label: string;
  href: string;
  mega: null | {
    columns: MegaColumn[];
    featured?: {
      badge?: string;
      img: string;
      title: string;
      desc: string;
      href: string;
      cta: string;
    };
  };
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/", mega: null },
  {
    label: "About Us",
    href: "/about-us",
    mega: {
      columns: [
        {
          heading: "Who We Are",
          items: [
            {
              label: "About PRIME",
              subtitle: "Our story & mission",
              href: "/about-us",
              img: "/assets/images/about-image.jpg",
            },
            {
              label: "Our Team",
              subtitle: "The people behind PRIME",
              href: "/team",
            },
          ],
        },
        {
          heading: "Programmes",
          items: [
            { label: "Incubation",            subtitle: "CM's E-Championship",   href: "/incubation"            },
            { label: "Market Linkage",        subtitle: "Trade & exhibitions",   href: "/market-linkage"        },
            { label: "Business Facilitation", subtitle: "Startup handholding",   href: "/business-facilitation" },
            { label: "Training Centres",      subtitle: "Skill development",     href: "/trainingcentres"       },
            { label: "Fellowship",            subtitle: "Deep-dive programme",   href: "/fellowship"            },
          ],
        },
        {
          heading: "Connect",
          items: [
            { label: "PRIME Portal",  subtitle: "Register your startup", href: "/register" },
            { label: "Contact Us",    subtitle: "Reach our team",        href: "/contact" },
            { label: "Grievance",     subtitle: "File a complaint",      href: "/grievance" },
          ],
        },
      ],
      featured: {
        badge: "About",
        img: "/assets/images/about-image.jpg",
        title: "Meghalaya's most ambitious bet on its people",
        desc: "From 2019 to today — how PRIME is reshaping the Northeast's economic landscape.",
        href: "/about-us",
        cta: "Read more",
      },
    },
  },
  {
    label: "Programmes",
    href: "#",
    mega: {
      columns: [
        {
          heading: "Incubation & Support",
          items: [
            { label: "CM's E-Championship",   subtitle: "75 founders, 9 months",   href: "/incubation"            },
            { label: "Business Facilitation", subtitle: "Handholding & liaison",   href: "/business-facilitation" },
            { label: "Market Linkage",        subtitle: "Trade & ONDC access",     href: "/market-linkage"        },
            { label: "Training Centres",      subtitle: "Sector-specific skills",  href: "/trainingcentres"       },
            { label: "Fellowship",            subtitle: "Deep-dive immersive",     href: "/fellowship"            },
          ],
        },
        {
          heading: "Funding & Schemes",
          items: [
            { label: "All Schemes",              subtitle: "Overview of all funds",     href: "/funding-schemes"                },
            { label: "CM Elevate",               subtitle: "Subsidy across 15 sectors", href: "/cm-elevate"                     },
            { label: "Entrepreneurship Fund",    subtitle: "Up to ₹75L zero-interest",  href: "/prime-entrepreneurship-funding" },
            { label: "IFAD GAP Funding",         subtitle: "Agriculture & food chains", href: "/ifad-gap-funding"               },
            { label: "Student Tinkering Fund",   subtitle: "Youth innovation grants",   href: "/student-tinkering-fund"         },
          ],
        },
      ],
      featured: {
        badge: "Apply Now",
        img: "/assets/images/about-image.jpg",
        title: "CM's E-Championship Challenge",
        desc: "75 selected founders. ₹2 lakh grant. IIM Calcutta certificate. Now open for its 7th edition.",
        href: "/incubation",
        cta: "Learn more",
      },
    },
  },
  {
    label: "Funding & Schemes",
    href: "/funding-schemes",
    mega: {
      columns: [
        {
          heading: "Grants & Subsidies",
          items: [
            { label: "CM Elevate",             subtitle: "35–75% project cost subsidy", href: "/cm-elevate"                     },
            { label: "Kick Start Grant",       subtitle: "Up to ₹10L non-returnable",   href: "/funding-schemes"                },
            { label: "Small Support Grant",    subtitle: "Up to ₹3L seed support",      href: "/funding-schemes"                },
            { label: "InnoVenture Grant",      subtitle: "Up to ₹35L for innovators",   href: "/funding-schemes"                },
            { label: "Student Tinkering Fund", subtitle: "Youth & campus innovation",   href: "/student-tinkering-fund"         },
          ],
        },
        {
          heading: "Loans & Investment",
          items: [
            { label: "Entrepreneurship Fund", subtitle: "Up to ₹75L zero-interest",  href: "/prime-entrepreneurship-funding" },
            { label: "IFAD GAP Funding",      subtitle: "Agriculture value chains",  href: "/ifad-gap-funding"               },
            { label: "All Schemes",           subtitle: "Full overview & eligibility", href: "/funding-schemes"              },
          ],
        },
      ],
      featured: {
        badge: "Flagship",
        img: "/assets/images/about-image.jpg",
        title: "CM Elevate — Meghalaya's sector subsidy programme",
        desc: "35–75% cost subsidy across 15+ sectors. Zero bureaucratic friction for eligible enterprises.",
        href: "/cm-elevate",
        cta: "Explore CM Elevate",
      },
    },
  },
  { label: "Entrepreneurs", href: "/entrepreneurs", mega: null },
  { label: "Updates", href: "/updates", mega: null },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled]         = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenDropdown(null); setMenuOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 bg-white/[0.88] backdrop-blur-md border border-black/[0.07] rounded-2xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_32px_rgba(0,0,0,0.10)]" : "shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      }`}
      role="banner"
      onMouseLeave={scheduleClose}
    >
      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[76px]">

        {/* Col 1 — Logo + tagline */}
        <Link href="/" className="flex shrink-0 items-start" onClick={() => setOpenDropdown(null)}>
          <Image
            src="/logo-color.png"
            alt="PRIME Meghalaya"
            width={160}
            height={48}
            className="h-8 w-auto object-contain object-left"
            priority
          />
        </Link>

        {/* Col 2 — Nav links */}
        <ul className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isOpen = openDropdown === link.label;
            return (
              <li key={link.label}>
                {link.mega ? (
                  <button
                    onMouseEnter={() => openMenu(link.label)}
                    onFocus={() => openMenu(link.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={`text-[15px] flex items-center gap-1.5 transition-colors py-1 font-medium ${
                      isOpen ? "text-black" : "text-black/50 hover:text-black"
                    }`}
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className={isOpen ? "text-[#2D6A4F]" : "opacity-50 text-current"}
                    >
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                        <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-black/50 hover:text-black transition-colors"
                    onMouseEnter={scheduleClose}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Col 3 — Right utility bar */}
        <div className="flex items-center gap-3 justify-end">
          {/* Apply CTA */}
          <Link
            href="/register"
            data-lpignore="true"
            data-form-type="other"
            onMouseEnter={scheduleClose}
            className="hidden md:inline-flex items-center gap-1 text-[15px] font-semibold text-black hover:text-[#2D6A4F] transition-colors"
          >
            Apply
          </Link>

          {/* Divider */}
          <span className="hidden md:block w-px h-4 bg-black/[0.12]" aria-hidden="true" />

          {/* Portal user icon */}
          <Link
            href="/login"
            aria-label="Sign in"
            onMouseEnter={scheduleClose}
            className="hidden md:flex items-center justify-center w-8 h-8 text-black/40 hover:text-black transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1 text-black/60 hover:text-black transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <motion.span animate={{ rotate: menuOpen ? 45 : 0,  y: menuOpen ? 6 : 0  }} className="block h-px bg-current" />
              <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}                        className="block h-px bg-current" />
              <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} className="block h-px bg-current" />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mega menu panel ── */}
      <AnimatePresence>
        {openDropdown && navLinks.find(l => l.label === openDropdown)?.mega && (
          <motion.div
            key={openDropdown}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white/[0.97] backdrop-blur-md border border-black/[0.07] rounded-2xl shadow-xl shadow-black/[0.08] z-50"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="region"
            aria-label={`${openDropdown} menu`}
          >
            <div className="max-w-7xl mx-auto px-8 lg:px-12 py-10">
              {(() => {
                const link = navLinks.find(l => l.label === openDropdown);
                if (!link?.mega) return null;
                const { columns, featured } = link.mega;

                return (
                  <div className={`grid gap-12 ${featured ? "grid-cols-[repeat(auto-fit,minmax(160px,1fr))_280px]" : "grid-cols-[repeat(auto-fit,minmax(160px,1fr))]"}`}>
                    {/* Columns */}
                    <div className={`grid gap-16 ${columns.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {columns.map((col) => (
                        <div key={col.heading}>
                          <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-black/30 mb-6 pb-3 border-b border-black/[0.07]">
                            {col.heading}
                          </p>
                          <ul className="flex flex-col gap-0.5">
                            {col.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  target={item.external ? "_blank" : undefined}
                                  rel={item.external ? "noopener noreferrer" : undefined}
                                  onClick={() => setOpenDropdown(null)}
                                  className="group flex items-start gap-3 py-2.5 rounded-sm hover:bg-black/[0.04] -mx-2 px-2 transition-colors"
                                >
                                  {item.img && (
                                    <div className="shrink-0 w-10 h-10 rounded-[2px] overflow-hidden bg-black/10 mt-0.5">
                                      <Image
                                        src={item.img}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[15px] font-semibold text-black/80 group-hover:text-black transition-colors leading-tight flex items-center gap-1.5">
                                      {item.label}
                                      {item.external && (
                                        <svg className="w-2.5 h-2.5 opacity-40" viewBox="0 0 10 10" fill="none">
                                          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        </svg>
                                      )}
                                    </p>
                                    {item.subtitle && (
                                      <p className="text-[11px] text-black/35 mt-0.5 leading-tight">{item.subtitle}</p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Featured card */}
                    {featured && (
                      <Link
                        href={featured.href}
                        onClick={() => setOpenDropdown(null)}
                        className="group relative overflow-hidden rounded-sm bg-black flex flex-col min-h-[240px]"
                      >
                        <Image
                          src={featured.img}
                          alt=""
                          fill
                          className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-[1.03] transition-all duration-500"
                        />
                        <div className="relative z-10 flex flex-col justify-end flex-1 p-5">
                          {featured.badge && (
                            <span className="inline-block self-start mb-3 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] uppercase bg-[#2D6A4F] text-white rounded-[2px]">
                              {featured.badge}
                            </span>
                          )}
                          <p className="text-[14px] font-black text-white leading-snug mb-1.5">
                            {featured.title}
                          </p>
                          <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                            {featured.desc}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#74C69D] group-hover:gap-3 transition-all duration-300">
                            {featured.cta} <span>→</span>
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden bg-white/[0.97] backdrop-blur-md border-t border-black/[0.07]"
        aria-hidden={!menuOpen}
      >
        <div className="px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href === "#" ? "/" : link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-black/70 hover:text-black text-sm font-medium border-b border-black/[0.07]"
              >
                {link.label}
              </Link>
              {link.mega && (
                <div className="pl-4 pt-1 pb-2 flex flex-col gap-0.5">
                  {link.mega.columns.flatMap(col => col.items).map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-black/45 hover:text-[#2D6A4F] text-[12px] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/register"
            className="mt-3 px-4 py-3 bg-black text-white text-sm font-bold text-center hover:bg-[#2D6A4F] hover:text-white transition-colors"
          >
            Apply to PRIME →
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
