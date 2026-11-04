import type { APIRoute } from "astro";
import { buildRobotsTxt } from "@/lib/seo/sitemap";

export const GET: APIRoute = ({ site }) => {
	if (!site) throw new Error("Set `site` in astro.config.mjs to generate robots.txt.");

	return new Response(buildRobotsTxt(new URL("/sitemap.xml", site).href), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
