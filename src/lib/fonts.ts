import localFont from "next/font/local";

export { GeistSans } from "geist/font/sans";

// Same file the `geist` package wraps, declared here so it is not preloaded.
// Only code blocks use it, so most pages never download the 70 KB font.
export const GeistMono = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: false,
  // Code is readable in the fallback mono font, so a first visit never
  // waits for this file; it is used from cache on later visits.
  display: "optional",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
});
