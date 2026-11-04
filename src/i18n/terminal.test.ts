import { describe, expect, it } from "vitest";
import { fill, terminalStrings } from "./terminal";

describe("fill", () => {
	it("replaces known placeholders and keeps unknown ones", () => {
		expect(fill("{n} of {total} items, {missing}", { n: 1, total: "4" })).toBe("1 of 4 items, {missing}");
	});
});

describe("terminalStrings", () => {
	function keyPaths(value: unknown, prefix = ""): string[] {
		if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
		if (value && typeof value === "object") {
			return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
		}
		return [prefix];
	}

	it("has the same keys and list lengths in every locale", () => {
		expect(keyPaths(terminalStrings.es)).toEqual(keyPaths(terminalStrings.en));
	});

	it("never leaves a string empty", () => {
		for (const locale of Object.values(terminalStrings)) {
			const flat = JSON.stringify(locale);
			expect(flat).not.toContain('""');
		}
	});
});
