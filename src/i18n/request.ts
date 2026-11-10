import { getRequestConfig } from "next-intl/server";
import { site } from "@/config/site";

/**
 * The interface is English only, so there is no locale to negotiate and no
 * locale segment in the URL. next-intl is kept for the message catalogue and
 * for date and number formatting, both of which need a locale to be named.
 */
export default getRequestConfig(async () => ({
  locale: site.locale,
  messages: (await import("../../messages/en.json")).default,
}));
