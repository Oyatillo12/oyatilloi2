import Image from "next/image";
import { getTranslations } from "next-intl/server";
import avatar from "@/assets/avatar.webp";
import { site } from "@/config/site";
import { HeroScene } from "@/components/home/hero-scene";
import { SocialLinks } from "@/components/home/social-links";

const delay = (ms: number) =>
  ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export async function Profile() {
  const t = await getTranslations("HomePage");

  // The scene sits above the text, not behind it: the top padding is the
  // room it occupies, so no copy is ever drawn over the moving colours.
  // The blocks below arrive in reading order; the delays are the only thing
  // that differs between them, and `.reveal` (globals.css) disappears under
  // prefers-reduced-motion.
  return (
    <section className="relative isolate flex flex-col items-center gap-5 pt-64 text-center sm:pt-84">
      {/* One caption per shape, in the order the scene shows them. */}
      <HeroScene
        captions={[
          t("scene.code"),
          t("scene.atom"),
          t("scene.globe"),
          t("scene.page"),
        ]}
      >
        {/* Already resized to well past the rendered size, so it is served
            as-is instead of through the image optimizer (ADR 0001: no
            runtime). */}
        <Image
          src={avatar}
          alt=""
          width={24}
          height={24}
          unoptimized
          className="size-6 rounded-full object-cover"
        />
      </HeroScene>
      <h1
        className="reveal text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        style={delay(80)}
      >
        {site.name}
      </h1>
      <p
        className="reveal max-w-xl text-pretty text-muted-foreground"
        style={delay(160)}
      >
        {t("about")}
      </p>
      <div className="reveal" style={delay(240)}>
        <SocialLinks />
      </div>
    </section>
  );
}
