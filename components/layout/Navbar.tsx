"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiInformationCircle, HiUsers, HiOfficeBuilding, HiGlobe,
  HiBriefcase, HiAcademicCap, HiStar, HiLightBulb, HiLink,
  HiCurrencyRupee, HiExternalLink, HiBookOpen, HiMail,
  HiClipboardList, HiHome, HiSpeakerphone, HiCog,
  HiLightningBolt, HiDocumentText, HiTrendingUp,
} from "react-icons/hi";
import type { IconType } from "react-icons";

type MegaItem = {
  label: string;
  subtitle?: string;
  href: string;
  img?: string;
  external?: boolean;
  icon?: IconType;
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

const tickerText = [
  "2847+ CM Elevate Graduates",
  "1350+ Registered Startups",
  "885+ Funding Cases Supported",
  "459 BFS Sector Startups",
  "353 Incubation Cohort Members",
  "287 Rural Enterprises",
  "Shillong · Tura · Nongpoh",
  "Est. 2019",
].join("   ·   ");

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
            { label: "About PRIME", subtitle: "Our story & mission",       href: "/about-us", img: "/assets/images/about-image.jpg", icon: HiInformationCircle },
            { label: "Our Team",    subtitle: "The people behind PRIME",   href: "/team",                                            icon: HiUsers             },
          ],
        },
        {
          heading: "Programmes",
          items: [
            { label: "Incubation",            subtitle: "CM's E-Championship",  href: "/incubation",            icon: HiOfficeBuilding },
            { label: "Market Linkage",        subtitle: "Trade & exhibitions",  href: "/market-linkage",        icon: HiGlobe          },
            { label: "Business Facilitation", subtitle: "Startup handholding",  href: "/business-facilitation", icon: HiBriefcase      },
            { label: "Training Centres",      subtitle: "Skill development",    href: "/trainingcentres",       icon: HiAcademicCap    },
            { label: "Fellowship",            subtitle: "Deep-dive programme",  href: "/fellowship",            icon: HiStar           },
          ],
        },
        {
          heading: "Our Network",
          items: [
            { label: "Mentors",   subtitle: "Experts guiding our founders",     href: "/mentors",   icon: HiLightBulb      },
            { label: "Partners",  subtitle: "Institutional & ecosystem allies",  href: "/partners",  icon: HiLink           },
            { label: "Investors", subtitle: "Funding connections for startups",  href: "/investors", icon: HiCurrencyRupee  },
          ],
        },
        {
          heading: "Connect",
          items: [
            { label: "PRIME Portal",   subtitle: "Register your startup", href: "/register",       icon: HiExternalLink  },
            { label: "Knowledge Base", subtitle: "Answers & guides",      href: "/knowledge-base", icon: HiBookOpen      },
            { label: "Contact Us",     subtitle: "Reach our team",        href: "/contact",        icon: HiMail          },
            { label: "Grievance",      subtitle: "File a complaint",      href: "/grievance",      icon: HiClipboardList },
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
    label: "Sectors",
    href: "#",
    mega: {
      columns: [
        {
          heading: "Core Sectors",
          items: [
            { label: "Incubation",                    subtitle: "CM's E-Championship",       href: "/incubation",            icon: HiOfficeBuilding },
            { label: "PRIME Rural",                   subtitle: "Village-level enterprise",  href: "/prime-rural",           icon: HiHome           },
            { label: "Business Facilitation Service", subtitle: "Handholding & liaison",     href: "/business-facilitation", icon: HiBriefcase      },
            { label: "Partnership",                   subtitle: "Institutional alliances",   href: "#",                      icon: HiLink           },
          ],
        },
        {
          heading: "Support Sectors",
          items: [
            { label: "CM Elevate",    subtitle: "Subsidy across 15 sectors", href: "/cm-elevate",        icon: HiTrendingUp   },
            { label: "Media & Comms", subtitle: "Outreach & storytelling",   href: "/media-entertainment",icon: HiSpeakerphone },
            { label: "Admin",         subtitle: "Operations & governance",   href: "/admin-governance",  icon: HiCog          },
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
            { label: "CM Elevate",             subtitle: "35–75% project cost subsidy", href: "/cm-elevate",             icon: HiCurrencyRupee },
            { label: "Kick Start Grant",       subtitle: "Up to ₹10L non-returnable",  href: "/funding-schemes",        icon: HiLightningBolt },
            { label: "Small Support Grant",    subtitle: "Up to ₹3L seed support",     href: "/funding-schemes",        icon: HiStar          },
            { label: "InnoVenture Grant",      subtitle: "Up to ₹35L for innovators",  href: "/funding-schemes",        icon: HiLightBulb     },
            { label: "Student Tinkering Fund", subtitle: "Youth & campus innovation",  href: "/student-tinkering-fund", icon: HiAcademicCap   },
          ],
        },
        {
          heading: "Loans & Investment",
          items: [
            { label: "Entrepreneurship Fund",        subtitle: "Up to ₹75L zero-interest",     href: "/prime-entrepreneurship-funding", icon: HiTrendingUp    },
            { label: "Training Centre Establishment",subtitle: "Up to ₹50L for training hubs", href: "/trainingcentres",               icon: HiOfficeBuilding},
            { label: "All Schemes",                  subtitle: "Full overview & eligibility",  href: "/funding-schemes",               icon: HiDocumentText  },
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState<string | null>(null);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) { setMenuOpen(false); setMobileOpen(null); }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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

  const pillCls = `bg-white/[0.88] backdrop-blur-md border border-black/[0.07] rounded-2xl transition-shadow duration-300 relative ${scrolled ? "shadow-[0_8px_32px_rgba(0,0,0,0.10)]" : "shadow-[0_2px_12px_rgba(0,0,0,0.06)]"}`;

  return (
    <header
      className="fixed top-4 left-4 right-4 z-50 flex flex-col gap-1.5"
      role="banner"
      onMouseLeave={scheduleClose}
    >
      {/* White nav pill */}
      <div className={pillCls}>

        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[76px]">

          {/* Col 1 — Logo */}
          <Link href="/" className="flex shrink-0 items-start" onClick={() => setOpenDropdown(null)}>
            <Image
              src="/logo-color.png"
              alt="PRIME Meghalaya"
              width={160}
              height={48}
              className="h-11 w-auto object-contain object-left"
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
                      className={`text-[15px] flex items-center gap-1.5 transition-colors py-1 font-medium ${isOpen ? "text-black" : "text-black/50 hover:text-black"}`}
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
            <Link
              href="/register"
              data-lpignore="true"
              data-form-type="other"
              onMouseEnter={scheduleClose}
              className="hidden md:inline-flex items-center gap-1 text-[15px] font-semibold text-black hover:text-[#2D6A4F] transition-colors"
            >
              Apply for PRIME ID
            </Link>
            <span className="hidden md:block w-px h-4 bg-black/[0.12]" aria-hidden="true" />
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
            <button
              className="md:hidden p-1 text-black/60 hover:text-black transition-colors"
              onClick={() => { const next = !menuOpen; setMenuOpen(next); if (!next) setMobileOpen(null); }}
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

        {/* Mega menu panel */}
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
                  const { columns } = link.mega;
                  const colGridCls =
                    columns.length === 2 ? "grid-cols-2" :
                    columns.length === 4 ? "grid-cols-4" :
                    "grid-cols-3";
                  return (
                    <div className={`grid gap-16 ${colGridCls}`}>
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
                                  className="group flex items-center gap-3 py-2 rounded-lg hover:bg-black/[0.04] -mx-2 px-2 transition-colors"
                                >
                                  {item.icon && (
                                    <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-black/[0.05] text-black/40 group-hover:bg-[#2D6A4F]/10 group-hover:text-[#2D6A4F] transition-colors duration-200">
                                      <item.icon size={16} />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[14px] font-semibold text-black/80 group-hover:text-black transition-colors leading-tight flex items-center gap-1.5">
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
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Mobile menu — sibling to pill so overflow-y-auto works without parent clipping */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white/[0.95] backdrop-blur-md border border-black/[0.07] rounded-2xl shadow-xl overflow-y-auto max-h-[calc(100dvh-104px)]"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-4 flex flex-col">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.mega ? (
                      <>
                        {/* Accordion trigger */}
                        <button
                          onClick={() => setMobileOpen(mobileOpen === link.label ? null : link.label)}
                          className="w-full flex items-center justify-between py-4 border-b border-black/[0.06]"
                          aria-expanded={mobileOpen === link.label}
                        >
                          <span className={`text-[15px] font-semibold transition-colors ${mobileOpen === link.label ? "text-black" : "text-black/60"}`}>
                            {link.label}
                          </span>
                          <motion.span
                            animate={{ rotate: mobileOpen === link.label ? 180 : 0 }}
                            transition={{ duration: 0.18 }}
                            className="text-black/30"
                          >
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </motion.span>
                        </button>

                        {/* Accordion panel */}
                        <AnimatePresence>
                          {mobileOpen === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="py-3 pb-4 flex flex-col gap-4">
                                {link.mega.columns.map((col) => (
                                  <div key={col.heading}>
                                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-black/30 mb-2 px-1">
                                      {col.heading}
                                    </p>
                                    <div className="flex flex-col gap-0.5">
                                      {col.items.map((item) => (
                                        <Link
                                          key={item.href + item.label}
                                          href={item.href}
                                          onClick={() => { setMenuOpen(false); setMobileOpen(null); }}
                                          className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[14px] font-medium text-black/55 hover:text-[#2D6A4F] hover:bg-black/[0.03] transition-colors"
                                        >
                                          {item.icon && (
                                            <div className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-black/[0.05] text-black/35">
                                              <item.icon size={14} />
                                            </div>
                                          )}
                                          <span>{item.label}</span>
                                          {item.external && (
                                            <svg className="w-2.5 h-2.5 opacity-30 shrink-0" viewBox="0 0 10 10" fill="none">
                                              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                            </svg>
                                          )}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-4 text-[15px] font-semibold text-black/60 hover:text-black border-b border-black/[0.06] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Bottom CTAs */}
                <div className="mt-5 pt-2 flex flex-col gap-2.5">
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3.5 bg-[#1B4332] text-white text-[14px] font-bold text-center hover:bg-[#2D6A4F] transition-colors"
                  >
                    Apply for PRIME ID →
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3.5 border border-black/[0.1] text-black/55 text-[14px] font-semibold text-center hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Green ticker — homepage only */}
      {pathname === "/" && <div className="bg-[#2D6A4F] rounded-xl overflow-hidden py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
        <div className="animate-marquee select-none flex">
          {[tickerText, tickerText].map((t, i) => (
            <span key={i} className="flex items-center pr-20 text-[11px] font-bold tracking-[0.2em] uppercase text-white whitespace-nowrap">
              {t}
            </span>
          ))}
        </div>
      </div>}

    </header>
  );
}
