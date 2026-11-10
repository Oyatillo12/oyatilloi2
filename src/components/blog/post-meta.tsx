import { getFormatter, getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function PostMeta({
  date,
  readingTime,
}: {
  date: string;
  readingTime: number;
}) {
  const format = await getFormatter();
  const t = await getTranslations("Blog");

  // The date and the reading time are interface text, so they keep the
  // interface language even inside an article written in another one.
  return (
    <p
      lang={site.locale}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <time dateTime={date}>
        {format.dateTime(new Date(date), {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <span aria-hidden>&middot;</span>
      <span>{t("readingTime", { minutes: readingTime })}</span>
    </p>
  );
}
