export const site = {
  name: "Oyatillo Abdushkurov",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // PLACEHOLDERS: the owner replaces these before launch. Only the GitHub
  // profile is real. The Telegram link is a channel, not a personal account.
  social: {
    github: "https://github.com/oyatilloabdushkurov120-cloud",
    linkedin: "https://www.linkedin.com/in/REPLACE-ME",
    telegram: "https://t.me/REPLACE-ME",
    instagram: "https://www.instagram.com/REPLACE-ME",
  },
} as const;
