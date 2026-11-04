export interface SitemapAlternate {
	hreflang: string;
	href: string;
}

export interface SitemapEntry {
	url: string;
	alternates: SitemapAlternate[];
}

export function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/** A sitemap where every entry lists all of its language alternates (including itself). */
export function buildSitemap(entries: SitemapEntry[]): string {
	const urls = entries.map((entry) => {
		const alternates = entry.alternates
			.map(
				(alternate) =>
					`    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`,
			)
			.join("\n");
		return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n${alternates}\n  </url>`;
	});

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...urls,
		"</urlset>",
		"",
	].join("\n");
}

/** Allows everything and advertises the sitemap. `/dev` stays crawlable so its `noindex` can be read. */
export function buildRobotsTxt(sitemapUrl: string): string {
	return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
}
