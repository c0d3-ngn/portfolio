// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	output: "static",
	site: "https://ivanpmartin.com",

	integrations: [react()],

	vite: {
		plugins: [tailwindcss()],
	},

	fonts: [
		{
			provider: fontProviders.google(),
			name: "Fraunces",
			cssVariable: "--font-display-raw",
		},
		{
			provider: fontProviders.google(),
			name: "Inter Tight",
			cssVariable: "--font-body-raw",
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono-raw",
		},
	],
});
