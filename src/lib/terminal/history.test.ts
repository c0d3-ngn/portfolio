import { describe, expect, it } from "vitest";
import { MAX_HISTORY, navigateHistory, pushHistory } from "./history";

describe("pushHistory", () => {
	it("ignores blank input and immediate repeats", () => {
		expect(pushHistory([], "   ")).toEqual([]);
		expect(pushHistory(["help"], "help")).toEqual(["help"]);
		expect(pushHistory(["help"], " about ")).toEqual(["help", "about"]);
	});

	it("keeps non-adjacent repeats", () => {
		expect(pushHistory(["help", "about"], "help")).toEqual(["help", "about", "help"]);
	});

	it("keeps only the newest entries", () => {
		const full = Array.from({ length: MAX_HISTORY }, (_, index) => `cmd${index}`);
		const next = pushHistory(full, "latest");
		expect(next).toHaveLength(MAX_HISTORY);
		expect(next[0]).toBe("cmd1");
		expect(next[next.length - 1]).toBe("latest");
	});
});

describe("navigateHistory", () => {
	const entries = ["help", "about", "projects"];

	it("does nothing without history", () => {
		expect(navigateHistory([], null, "up")).toEqual({ cursor: null, value: null });
	});

	it("walks backwards and stops at the oldest entry", () => {
		const first = navigateHistory(entries, null, "up");
		expect(first).toEqual({ cursor: 2, value: "projects" });
		const second = navigateHistory(entries, first.cursor, "up");
		expect(second).toEqual({ cursor: 1, value: "about" });
		const third = navigateHistory(entries, 0, "up");
		expect(third).toEqual({ cursor: 0, value: "help" });
	});

	it("walks forwards and restores the draft past the newest entry", () => {
		expect(navigateHistory(entries, 0, "down")).toEqual({ cursor: 1, value: "about" });
		expect(navigateHistory(entries, 2, "down")).toEqual({ cursor: null, value: null });
	});

	it("ignores down while on the draft", () => {
		expect(navigateHistory(entries, null, "down")).toEqual({ cursor: null, value: null });
	});
});
