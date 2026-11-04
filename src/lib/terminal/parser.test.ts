import { describe, expect, it } from "vitest";
import { findUnknownFlag, getFlagValue, getPositionals, hasFlag, MAX_INPUT_LENGTH, parseInput } from "./parser";

describe("parseInput", () => {
	it("returns an empty name for blank input", () => {
		expect(parseInput("")).toEqual({ name: "", args: [] });
		expect(parseInput("   \t ")).toEqual({ name: "", args: [] });
	});

	it("lowercases the command name and keeps arguments verbatim", () => {
		expect(parseInput("  PROJECTS --Tag Python ")).toEqual({ name: "projects", args: ["--Tag", "Python"] });
	});

	it("keeps quoted text together", () => {
		expect(parseInput("echo \"hello   world\" 'a b'")).toEqual({ name: "echo", args: ["hello   world", "a b"] });
	});

	it("keeps empty quoted arguments", () => {
		expect(parseInput('echo ""')).toEqual({ name: "echo", args: [""] });
	});

	it("tolerates unbalanced quotes", () => {
		expect(parseInput('echo "unterminated text')).toEqual({ name: "echo", args: ["unterminated text"] });
	});

	it("truncates overly long input", () => {
		const parsed = parseInput(`echo ${"a".repeat(MAX_INPUT_LENGTH * 2)}`);
		expect(parsed.args[0]?.length).toBe(MAX_INPUT_LENGTH - "echo ".length);
	});
});

describe("flag helpers", () => {
	const args = ["--tag", "python", "-f", "extra", "--stack=docker"];

	it("detects flags by any spelling", () => {
		expect(hasFlag(args, "--featured", "-f")).toBe(true);
		expect(hasFlag(args, "--current")).toBe(false);
		expect(hasFlag(args, "--stack")).toBe(true);
	});

	it("reads values in both spaced and equals form", () => {
		expect(getFlagValue(args, "--tag")).toBe("python");
		expect(getFlagValue(args, "--stack")).toBe("docker");
	});

	it("returns undefined for missing or valueless flags", () => {
		expect(getFlagValue(args, "--missing")).toBeUndefined();
		expect(getFlagValue(["--tag"], "--tag")).toBeUndefined();
		expect(getFlagValue(["--tag", "--other"], "--tag")).toBeUndefined();
		expect(getFlagValue(["--tag="], "--tag")).toBeUndefined();
	});

	it("extracts positionals while skipping flag values", () => {
		expect(getPositionals(args, ["--tag"])).toEqual(["extra"]);
		expect(getPositionals(["2", "-v"])).toEqual(["2"]);
	});

	it("treats negative numbers as positionals, not flags", () => {
		expect(getPositionals(["-1"])).toEqual(["-1"]);
	});
});

describe("findUnknownFlag", () => {
	const known = ["--tag", "--featured", "-f"];

	it("returns the first unrecognized flag", () => {
		expect(findUnknownFlag(["--tag", "x", "--bogus"], known)).toBe("--bogus");
		expect(findUnknownFlag(["-z"], known)).toBe("-z");
	});

	it("accepts known flags in equals form and ignores positionals", () => {
		expect(findUnknownFlag(["--tag=x", "-f", "2"], known)).toBeUndefined();
	});
});
