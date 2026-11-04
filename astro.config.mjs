// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	output: "static",
	site: "https://ivanpmartin.com",

	integrations: [react()],

	i18n: {
		locales: ["en", "es"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	fonts: [
		{
			provider: fontProviders.google(),
			name: "Fraunces",
			cssVariable: "--font-display-raw",
			styles: ["normal"],
		},
		{
			provider: fontProviders.google(),
			name: "Inter Tight",
			cssVariable: "--font-body-raw",
			styles: ["normal"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono-raw",
			styles: ["normal"],
		},
	],
});
