import { describe, expect, it } from "vitest";
import { buildRobotsTxt, buildSitemap, escapeXml } from "./sitemap";

describe("escapeXml", () => {
	it("escapes the five XML special characters", () => {
		expect(escapeXml(`a&b<c>"d"'e'`)).toBe("a&amp;b&lt;c&gt;&quot;d&quot;&apos;e&apos;");
	});
});

describe("buildSitemap", () => {
	const alternates = [
		{ hreflang: "en", href: "https://example.com/" },
		{ hreflang: "es", href: "https://example.com/es/" },
		{ hreflang: "x-default", href: "https://example.com/" },
	];
	const xml = buildSitemap([
		{ url: "https://example.com/", alternates },
		{ url: "https://example.com/es/", alternates },
	]);

	it("is a well-formed urlset with the xhtml namespace", () => {
		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
		expect(xml.trimEnd().endsWith("</urlset>")).toBe(true);
	});

	it("lists each url once with all of its alternates", () => {
		expect(xml.match(/<loc>/g)).toHaveLength(2);
		expect(xml.match(/hreflang="es"/g)).toHaveLength(2);
		expect(xml.match(/hreflang="x-default"/g)).toHaveLength(2);
	});

	it("escapes URLs", () => {
		const escaped = buildSitemap([{ url: "https://example.com/?a=1&b=2", alternates: [] }]);
		expect(escaped).toContain("?a=1&amp;b=2");
	});
});

describe("buildRobotsTxt", () => {
	it("allows crawling and points at the sitemap", () => {
		expect(buildRobotsTxt("https://example.com/sitemap.xml")).toBe(
			"User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n",
		);
	});
});
