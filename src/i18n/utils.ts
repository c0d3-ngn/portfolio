import { DEFAULT_LOCALE, LOCALES, type Locale, type UiStrings, ui } from "./ui";

/** Returns the locale encoded in the first path segment, or the default locale. */
export function getLocaleFromPath(pathname: string): Locale {
	const [, firstSegment] = pathname.split("/");
	return LOCALES.find((locale) => locale === firstSegment && locale !== DEFAULT_LOCALE) ?? DEFAULT_LOCALE;
}

/** Strips the locale prefix, always returning a path that starts with `/`. */
export function stripLocale(pathname: string): string {
	const locale = getLocaleFromPath(pathname);
	if (locale === DEFAULT_LOCALE) return pathname || "/";
	const rest = pathname.slice(`/${locale}`.length);
	return rest.startsWith("/") ? rest : `/${rest}`;
}

/** Prefixes a locale-less path with the locale; the default locale is unprefixed. */
export function localizePath(path: string, locale: Locale): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	if (locale === DEFAULT_LOCALE) return normalized;
	return normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`;
}

/** The same page in another locale. */
export function getAlternatePath(pathname: string, target: Locale): string {
	return localizePath(stripLocale(pathname), target);
}

export function getUi(locale: Locale): UiStrings {
	return ui[locale];
}
