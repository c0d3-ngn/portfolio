import { describe, expect, it } from "vitest";
import { formatCareerPeriod, yearsOfExperience } from "./format";

describe("formatCareerPeriod", () => {
	it("shows a range, a single year, or the present label", () => {
		expect(formatCareerPeriod(new Date("2021-07-01"), new Date("2023-01-01"))).toBe("2021 — 2023");
		expect(formatCareerPeriod(new Date("2022-01-01"), new Date("2022-07-01"))).toBe("2022");
		expect(formatCareerPeriod(new Date("2022-10-01"))).toBe("2022 — Present");
		expect(formatCareerPeriod(new Date("2022-10-01"), undefined, "Actualidad")).toBe("2022 — Actualidad");
	});
});

describe("yearsOfExperience", () => {
	const now = new Date("2026-11-04");

	it("counts years since the earliest start", () => {
		expect(yearsOfExperience([new Date("2022-10-01"), new Date("2021-07-01"), new Date("2022-01-01")], now)).toBe(5);
	});

	it("is zero without entries or when the start is in the future", () => {
		expect(yearsOfExperience([], now)).toBe(0);
		expect(yearsOfExperience([new Date("2030-01-01")], now)).toBe(0);
	});
});
