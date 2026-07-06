import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const footerColumns = [
  {
    heading: "About PRIME",
    links: [
      { label: "About Us",          href: "/about-us"          },
      { label: "Our Team",          href: "/team"              },
      { label: "Incubation",        href: "/incubation"        },
      { label: "Funding & Schemes", href: "/funding-schemes"   },
      { label: "Entrepreneurs",     href: "/entrepreneurs"     },
      { label: "Updates",           href: "/updates"           },
    ],
  },
  {
    heading: "Sectors",
    links: [
      { label: "Incubation",                    href: "/incubation"            },
      { label: "PRIME Rural",                   href: "/prime-rural"           },
      { label: "Business Facilitation Service", href: "/business-facilitation" },
      { label: "Partnership",                   href: "#"                      },
      { label: "CM Elevate",                    href: "/cm-elevate"            },
      { label: "Funding",                       href: "/funding-schemes"       },
      { label: "Monitoring & Evaluation",       href: "/media-entertainment"   },
      { label: "Media & Comms",                 href: "#"                      },
      { label: "Admin",                         href: "#"                      },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",      href: "/privacy-policy"        },
      { label: "Terms & Conditions",  href: "/terms-and-conditions"  },
      { label: "Grievance Redressal", href: "/grievance"             },
      { label: "PRIME Portal",        href: "https://portal.primemeghalaya.com/GeneralRegistraion.php" },
    ],
  },
];

const socials = [
  { label: "Facebook",  href: "https://www.facebook.com/primemeghalaya/",                        Icon: FaFacebook   },
  { label: "Instagram", href: "https://www.instagram.com/primemeghalaya/",                       Icon: FaInstagram  },
  { label: "LinkedIn",  href: "https://in.linkedin.com/company/prime-startup-meghalaya",         Icon: FaLinkedinIn },
  { label: "YouTube",   href: "https://www.youtube.com/channel/UCqVwccQWXyVIc-v6lg_0nbw",       Icon: FaYoutube    },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/logo-white.png"
                alt="PRIME Meghalaya"
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-white/50 leading-relaxed max-w-[220px]" style={{ fontSize: "13px" }}>
              Meghalaya&apos;s premier entrepreneurship hub — empowering founders to build, grow, and thrive.
            </p>
            <div>
              <p className="text-white/30 mb-3 font-medium tracking-wide uppercase" style={{ fontSize: "11px" }}>
                Follow us
              </p>
              <div className="flex items-center gap-2.5">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#52B788] flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <s.Icon size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-bold text-white mb-5 tracking-wide" style={{ fontSize: "13px" }}>
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/45 hover:text-white transition-colors duration-200"
                      style={{ fontSize: "13px" }}
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
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25" style={{ fontSize: "12px" }}>
            © {new Date().getFullYear()} All Rights Reserved — PRIME Meghalaya
          </p>
          <p className="text-white/20" style={{ fontSize: "12px" }}>
            Government of Meghalaya
          </p>
        </div>
      </div>
    </footer>
  );
}
