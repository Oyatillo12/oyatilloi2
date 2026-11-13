export const site = {
  name: "Oyatillo Abdishukurov",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** The interface language. The site is not translated; see docs/adr/0003. */
  locale: "en",
  social: {
    github: "https://github.com/Oyatillo12",
    linkedin: "https://www.linkedin.com/in/oyatillo12",
    telegram: "https://t.me/Oyatilloi2",
    instagram: "https://www.instagram.com/oyatilloi2",
    x: "https://x.com/oyatilloi2",
  },
} as const;
