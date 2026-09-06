import { getFormatter, getTranslations } from "next-intl/server";

export async function PostMeta({
  date,
  readingTime,
}: {
  date: string;
  readingTime: number;
}) {
  const format = await getFormatter();
  const t = await getTranslations("Blog");

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
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
