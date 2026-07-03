"use client";

import { useState } from "react";

interface HoverCardProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  as?: "div" | "a" | "li";
  href?: string;
  target?: string;
  rel?: string;
}

export default function HoverCard({
  children,
  color = "#2D6A4F",
  className = "",
  as: Tag = "div",
  href,
  target,
  rel,
}: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  const style = {
    border: `1px solid ${hovered ? color : "rgba(0,0,0,0.07)"}`,
    boxShadow: hovered ? `0 0 0 1px ${color}, 0 0 24px ${color}33` : "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
  };

  if (Tag === "a") {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`bg-white block group ${className}`}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </a>
    );
  }

  return (
    <Tag
      className={`bg-white group ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Tag>
  );
}
