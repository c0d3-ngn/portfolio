import { describe, expect, it } from "vitest";
import { ALL_FILTER, collectSharedKeys, filterByKey } from "./project-filter";

const projects = [
	{ title: "a", stack: ["Python", "Docker"] },
	{ title: "b", stack: ["Angular"] },
	{ title: "c", stack: ["Python"] },
];
const getStack = (project: (typeof projects)[number]) => project.stack;

describe("filterByKey", () => {
	it("returns everything for the all sentinel", () => {
		expect(filterByKey(projects, ALL_FILTER, getStack)).toEqual(projects);
	});

	it("keeps only entries with the key", () => {
		expect(filterByKey(projects, "Python", getStack).map((p) => p.title)).toEqual(["a", "c"]);
	});

	it("returns nothing for an unknown key", () => {
		expect(filterByKey(projects, "Rust", getStack)).toEqual([]);
	});
});

describe("collectSharedKeys", () => {
	it("keeps keys shared by at least two lists, most frequent first", () => {
		const lists = [["Docker", "Angular"], ["Docker", "Python"], ["Docker", "Angular", "Python"], ["Java"]];
		expect(collectSharedKeys(lists)).toEqual(["Docker", "Angular", "Python"]);
	});

	it("counts a key once per list", () => {
		expect(collectSharedKeys([["A", "A"], ["B"]])).toEqual([]);
	});

	it("honours a custom threshold", () => {
		expect(collectSharedKeys([["A"], ["B"]], 1)).toEqual(["A", "B"]);
	});
});
