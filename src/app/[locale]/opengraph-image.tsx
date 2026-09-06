import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    namespace: "Site",
  });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 24,
        padding: 80,
        background: "#0f0f0f",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1.1 }}>{site.name}</div>
      <div style={{ fontSize: 32, color: "#a1a1a1" }}>{t("description")}</div>
    </div>,
    size,
  );
}
