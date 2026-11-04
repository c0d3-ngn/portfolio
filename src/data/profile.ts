import type { Locale } from "@/i18n/ui";

export type Localized<T> = Record<Locale, T>;

export interface Address {
	locality: string;
	countryCode: string;
}

export interface Social {
	label: string;
	url: string;
	handle: string;
}

export interface Profile {
	name: string;
	displayLines: string[];
	role: string;
	location: string;
	tagline: string;
	metaDescription: string;
	timeZone: string;
	address: Address;
	languages: string[];
	stackSummary: string[];
	email: string;
	socials: Social[];
}

interface ProfileSource {
	name: string;
	displayLines: string[];
	role: Localized<string>;
	location: Localized<string>;
	tagline: Localized<string>;
	metaDescription: Localized<string>;
	timeZone: string;
	address: Address;
	languages: string[];
	stackSummary: string[];
	email: string;
	socials: Social[];
}

export const profileSource: ProfileSource = {
	name: "Ivan Martin Prieto",
	displayLines: ["Ivan", "Martin", "Prieto"],
	role: {
		en: "Full Stack Developer",
		es: "Desarrollador Full Stack",
	},
	location: {
		en: "Madrid, Spain",
		es: "Madrid, España",
	},
	tagline: {
		en: "Computer Science Engineer who turns complex problems into reliable software. Five-plus years building full stack web applications and the infrastructure behind them.",
		es: "Ingeniero Informático que convierte problemas complejos en software fiable. Más de cinco años construyendo aplicaciones web full stack y la infraestructura que las sostiene.",
	},
	metaDescription: {
		en: "Computer Science Engineer and Full Stack Developer in Madrid. 5+ years building web apps with Angular, React, Python, Node.js and Java Spring Boot.",
		es: "Ingeniero Informático y desarrollador Full Stack en Madrid. Más de 5 años creando apps web con Angular, React, Python, Node.js y Java Spring Boot.",
	},
	timeZone: "Europe/Madrid",
	address: { locality: "Madrid", countryCode: "ES" },
	languages: ["en", "es"],
	stackSummary: ["Angular", "React", "TypeScript", "Python", "Java / Spring Boot", "Docker", "Node.js"],
	email: "contact@ivanpmartin.com",
	socials: [
		{ label: "GitHub", url: "https://github.com/c0d3-ngn", handle: "@c0d3-ngn" },
		{ label: "LinkedIn", url: "https://www.linkedin.com/in/ivan-m-p/", handle: "@ivan-m-p" },
	],
};

/** Resolves every localized field of the profile for the given locale. */
export function getProfile(locale: Locale): Profile {
	return {
		...profileSource,
		role: profileSource.role[locale],
		location: profileSource.location[locale],
		tagline: profileSource.tagline[locale],
		metaDescription: profileSource.metaDescription[locale],
	};
}
