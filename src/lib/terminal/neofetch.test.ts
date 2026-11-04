import { describe, expect, it } from "vitest";
import { terminalStrings } from "../../i18n/terminal";
import { makeData } from "./fixtures";
import { buildNeofetch, LOGO_LINES } from "./neofetch";
import { blockToString } from "./output";

describe("buildNeofetch", () => {
	it("renders a split block with the logo aside", () => {
		const block = buildNeofetch(makeData(), terminalStrings.en);
		expect(block.kind).toBe("split");
		if (block.kind === "split") expect(block.aside).toHaveLength(LOGO_LINES.length);
	});

	it("keeps the logo rows the same width", () => {
		expect(new Set(LOGO_LINES.map((line) => line.length)).size).toBe(1);
	});

	it("shows profile facts, derived years and the current role", () => {
		const text = blockToString(buildNeofetch(makeData(), terminalStrings.en));
		expect(text).toContain("ada@portfolio");
		expect(text).toContain("5+ years");
		expect(text).toContain("Mathematician @ Babbage & Co");
		expect(text).toContain("@ada");
		expect(text).toContain("Python, Docker");
	});

	it("localizes labels", () => {
		const text = blockToString(buildNeofetch(makeData("es"), terminalStrings.es));
		expect(text).toContain("Experiencia");
		expect(text).toContain("5+ años");
	});
});
