import { describe, expect, it } from "vitest";
import { getAlternatePath, getLocaleFromPath, localizePath, stripLocale } from "./utils";

describe("getLocaleFromPath", () => {
	it("returns the default locale for unprefixed paths", () => {
		expect(getLocaleFromPath("/")).toBe("en");
		expect(getLocaleFromPath("/dev")).toBe("en");
	});

	it("detects the Spanish prefix", () => {
		expect(getLocaleFromPath("/es")).toBe("es");
		expect(getLocaleFromPath("/es/")).toBe("es");
		expect(getLocaleFromPath("/es/dev")).toBe("es");
	});

	it("does not treat look-alike segments as a locale", () => {
		expect(getLocaleFromPath("/espresso")).toBe("en");
	});
});

describe("stripLocale", () => {
	it("keeps unprefixed paths", () => {
		expect(stripLocale("/dev")).toBe("/dev");
	});

	it("removes the locale prefix", () => {
		expect(stripLocale("/es/")).toBe("/");
		expect(stripLocale("/es")).toBe("/");
		expect(stripLocale("/es/dev")).toBe("/dev");
	});
});

describe("localizePath", () => {
	it("leaves the default locale unprefixed", () => {
		expect(localizePath("/", "en")).toBe("/");
		expect(localizePath("/dev", "en")).toBe("/dev");
	});

	it("prefixes other locales", () => {
		expect(localizePath("/", "es")).toBe("/es/");
		expect(localizePath("/dev", "es")).toBe("/es/dev");
		expect(localizePath("dev", "es")).toBe("/es/dev");
	});
});

describe("getAlternatePath", () => {
	it("switches between locales for the same page", () => {
		expect(getAlternatePath("/", "es")).toBe("/es/");
		expect(getAlternatePath("/es/", "en")).toBe("/");
		expect(getAlternatePath("/es/dev", "en")).toBe("/dev");
		expect(getAlternatePath("/dev", "es")).toBe("/es/dev");
	});
});
