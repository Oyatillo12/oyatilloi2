import Image from "next/image";
import { getTranslations } from "next-intl/server";
import avatar from "@/assets/avatar.webp";
import { site } from "@/config/site";
import { SocialLinks } from "@/components/home/social-links";

export async function Profile() {
  const t = await getTranslations("HomePage");

  return (
    <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
      {/* Already resized to 2× the rendered size, so it is served as-is
          instead of through the image optimizer (ADR 0001: no runtime). */}
      <Image
        src={avatar}
        alt={site.name}
        width={112}
        height={112}
        priority
        unoptimized
        className="size-28 shrink-0 rounded-full border border-border object-cover"
      />
      <div className="flex min-w-0 flex-col gap-3">
        <h1 className="text-2xl font-medium">{site.name}</h1>
        <p className="text-muted-foreground">{t("about")}</p>
        <SocialLinks />
      </div>
    </section>
  );
}
