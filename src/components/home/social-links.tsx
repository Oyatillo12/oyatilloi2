import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  XIcon,
} from "@/components/icons/brand-icons";

export async function SocialLinks() {
  const t = await getTranslations("Social");

  const links = [
    { label: t("linkedin"), href: site.social.linkedin, Icon: LinkedInIcon },
    { label: t("github"), href: site.social.github, Icon: GitHubIcon },
    { label: t("telegram"), href: site.social.telegram, Icon: TelegramIcon },
    { label: t("instagram"), href: site.social.instagram, Icon: InstagramIcon },
    { label: t("x"), href: site.social.x, Icon: XIcon },
  ];

  return (
    <ul className="flex items-center gap-1">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            rel="me noopener"
            target="_blank"
            aria-label={label}
            data-tooltip={label}
            className="tooltip flex size-9 items-center justify-center rounded-lg text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
