import type { SVGProps } from "react";
import { siGithub, siInstagram, siTelegram, siX } from "simple-icons";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

// Simple Icons paths are drawn on a 24×24 grid and filled with currentColor.
function brandIcon(path: string) {
  function BrandIcon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  }

  return BrandIcon;
}

export const GitHubIcon = brandIcon(siGithub.path);
export const TelegramIcon = brandIcon(siTelegram.path);
export const InstagramIcon = brandIcon(siInstagram.path);
export const XIcon = brandIcon(siX.path);

// Simple Icons removed LinkedIn at the brand owner's request, so this is the
// glyph the package used to ship (CC0), kept here on the same 24×24 grid.
export const LinkedInIcon = brandIcon(
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
);
