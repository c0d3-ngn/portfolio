import { describe, expect, it } from "vitest";
import { editDistance, suggest } from "./suggest";

describe("editDistance", () => {
	it("measures insertions, deletions and substitutions", () => {
		expect(editDistance("", "abc")).toBe(3);
		expect(editDistance("abc", "abc")).toBe(0);
		expect(editDistance("kitten", "sitting")).toBe(3);
		expect(editDistance("projcts", "projects")).toBe(1);
	});
});

describe("suggest", () => {
	const names = ["help", "projects", "career", "contact", "neofetch", "?"];

	it("suggests the closest command for a typo", () => {
		expect(suggest("projcts", names)).toBe("projects");
		expect(suggest("carrer", names)).toBe("career");
	});

	it("returns undefined when nothing is close", () => {
		expect(suggest("zzzzzz", names)).toBeUndefined();
	});

	it("does not suggest the input itself or one-character names", () => {
		expect(suggest("help", names)).toBeUndefined();
		expect(suggest("x", names)).toBeUndefined();
	});
});
