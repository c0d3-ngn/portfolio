import { describe, expect, it } from "vitest";
import { filterByLocale } from "./locale-filter";

const entries = [{ id: "en/a" }, { id: "es/a" }, { id: "en/b" }, { id: "espresso/c" }];

describe("filterByLocale", () => {
	it("keeps only entries under the locale folder", () => {
		expect(filterByLocale(entries, "en")).toEqual([{ id: "en/a" }, { id: "en/b" }]);
		expect(filterByLocale(entries, "es")).toEqual([{ id: "es/a" }]);
	});
});
