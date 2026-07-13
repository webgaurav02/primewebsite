import type { TemplateIconKey } from "../templates";

/**
 * Inline monochrome line icons (currentColor), no dependency — mirrors the
 * inline-SVG approach in Footer.tsx. Server-safe (no hooks/state).
 */
type IconProps = { className?: string };

function Svg({
  className = "h-5 w-5",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IncubationIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 13c0-5 3-9 7-11 4 2 7 6 7 11l-3 3H8l-3-3Z" />
    <circle cx="12" cy="9" r="2" />
    <path d="M8 16c-1 1-1.5 2.5-1.5 4 1.5 0 3-.5 4-1.5M16 16c1 1 1.5 2.5 1.5 4-1.5 0-3-.5-4-1.5" />
  </Svg>
);
export const FundingIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M9 9h4M9 12h4M11 9c1.5 0 2.5 1 2.5 2.5S12.5 14 11 14H9l3 3" />
  </Svg>
);
export const HubIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V8l8-4 8 4v12" />
    <path d="M9 20v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 12h.01M16 12h.01" />
  </Svg>
);
export const MentorshipIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <path d="M16 4.5a3 3 0 0 1 0 6M18 14c2 .5 3.5 2.5 3.5 5" />
  </Svg>
);
export const EventsIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9h17M8 3v4M16 3v4M8 13h3M8 16h6" />
  </Svg>
);
export const PortalIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M3 8h18M6 6h.01M9 6h.01M8 21h8M12 17v4" />
  </Svg>
);
export const SchemeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
    <path d="M9 9h6M9 12h6M9 15h3" />
  </Svg>
);
export const ConcernIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="M12 8v4M12 15h.01" />
  </Svg>
);
export const CustomIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16v11H8l-4 4V5Z" />
    <path d="M9 10h.01M12 10h.01M15 10h.01" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12.5l5 5 11-11" />
  </Svg>
);
export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </Svg>
);
export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 22 20H2L12 3.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
);
export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);
export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
);
export const CopyIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </Svg>
);
export const EditIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
    <path d="M14 6l4 4" />
  </Svg>
);
export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
  </Svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);

export const TEMPLATE_ICONS: Record<
  TemplateIconKey,
  (p: IconProps) => React.ReactElement
> = {
  incubation: IncubationIcon,
  funding: FundingIcon,
  hub: HubIcon,
  mentorship: MentorshipIcon,
  events: EventsIcon,
  portal: PortalIcon,
  scheme: SchemeIcon,
  concern: ConcernIcon,
  custom: CustomIcon,
};
