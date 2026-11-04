import { describe, expect, it } from "vitest";
import { markdownToPlainText } from "./markdown";

describe("markdownToPlainText", () => {
	it("keeps paragraphs and collapses extra blank lines", () => {
		expect(markdownToPlainText("One.\n\n\n\nTwo.")).toBe("One.\n\nTwo.");
	});

	it("removes emphasis, inline code and links but keeps their text", () => {
		expect(markdownToPlainText("**Bold** and *italic* with `code` and [a link](https://example.com).")).toBe(
			"Bold and italic with code and a link.",
		);
	});

	it("drops heading markers and normalizes bullets", () => {
		expect(markdownToPlainText("## Title\n\n- first\n* second")).toBe("Title\n\n• first\n• second");
	});

	it("keeps image alt text", () => {
		expect(markdownToPlainText("![diagram](a.png)")).toBe("diagram");
	});

	it("trims surrounding whitespace and normalizes line endings", () => {
		expect(markdownToPlainText("\r\n  Hello  \r\n")).toBe("Hello");
	});

	it("leaves plain text such as snake_case untouched", () => {
		expect(markdownToPlainText("use snake_case_names here")).toBe("use snake_case_names here");
	});
});
