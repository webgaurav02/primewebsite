import Link from "next/link";
import Image from "next/image";

const footerColumns = [
  {
    heading: "About PRIME",
    links: [
      { label: "About Us",             href: "/about-us"                                               },
      { label: "Our Team",             href: "/team"                                                   },
      { label: "Incubation",           href: "/incubation"                                             },
      { label: "Funding & Schemes",    href: "/funding-schemes"                                        },
      { label: "Contact Us",           href: "/grievance"                                              },
    ],
  },
  {
    heading: "Programmes",
    links: [
      { label: "CM Elevate",                  href: "/cm-elevate"                    },
      { label: "Fellowship",                  href: "/fellowship"                    },
      { label: "Market Linkage",              href: "/market-linkage"                },
      { label: "Business Facilitation",       href: "/business-facilitation"         },
      { label: "Training Centres",            href: "/trainingcentres"               },
      { label: "PRIME Entrepreneurship Fund", href: "/prime-entrepreneurship-funding"},
      { label: "IFAD GAP Funding",            href: "/ifad-gap-funding"              },
      { label: "Student Tinkering Fund",      href: "/student-tinkering-fund"        },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",        href: "/privacy-policy"       },
      { label: "Terms & Conditions",    href: "/terms-and-conditions" },
      { label: "Grievance Redressal",   href: "/grievance"            },
      { label: "Portal",                href: "https://portal.primemeghalaya.com/GeneralRegistraion.php" },
    ],
  },
];

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#111111" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="PRIME Meghalaya"
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-[220px]">
              Meghalaya&apos;s premier entrepreneurship hub — empowering founders to build, grow, and thrive.
            </p>
            <div>
              <p className="text-[12px] text-gray-500 mb-3 font-medium tracking-wide">
                Stay in touch with us
              </p>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#9EC84A] flex items-center justify-center text-white transition-colors"
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[14px] font-bold text-white mb-5 tracking-wide">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 text-center">
          <p className="text-[12px] text-gray-500">
            © {new Date().getFullYear()} All Rights Reserved By PRIME Meghalaya
          </p>
        </div>
      </div>
    </footer>
  );
}
