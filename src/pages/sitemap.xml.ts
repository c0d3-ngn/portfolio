import type { APIRoute } from "astro";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/ui";
import { localizePath } from "@/i18n/utils";
import { buildSitemap } from "@/lib/seo/sitemap";

export const GET: APIRoute = ({ site }) => {
	if (!site) throw new Error("Set `site` in astro.config.mjs to generate the sitemap.");

	const homeUrl = (locale: (typeof LOCALES)[number]) => new URL(localizePath("/", locale), site).href;
	const alternates = [
		...LOCALES.map((locale) => ({ hreflang: locale, href: homeUrl(locale) })),
		{ hreflang: "x-default", href: homeUrl(DEFAULT_LOCALE) },
	];
	const entries = LOCALES.map((locale) => ({ url: homeUrl(locale), alternates }));

	return new Response(buildSitemap(entries), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
