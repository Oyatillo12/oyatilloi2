export const site = {
  name: "Oyatillo Abdishukurov",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** The interface language. The site is not translated; see docs/adr/0003. */
  locale: "en",
  social: {
    github: "https://github.com/Oyatillo12",
    linkedin: "https://www.linkedin.com/in/oyatillo12",
    // PLACEHOLDERS: the owner replaces these before launch.
    telegram: "https://t.me/REPLACE-ME",
    instagram: "https://www.instagram.com/REPLACE-ME",
  },
} as const;
