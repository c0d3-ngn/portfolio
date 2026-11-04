import { describe, expect, it } from "vitest";
import { commands } from "./commands";
import { makeContext } from "./fixtures";
import { resultToString } from "./output";
import { createRegistry } from "./registry";
import { runCommand } from "./run";
import type { Command } from "./types";

const registry = createRegistry(commands);

describe("runCommand", () => {
	it("returns nothing for blank input", () => {
		expect(runCommand("   ", registry, makeContext())).toEqual({ output: [] });
	});

	it("runs a known command and its aliases, case-insensitively", () => {
		expect(resultToString(runCommand("ABOUT", registry, makeContext()))).toContain("First paragraph.");
		expect(resultToString(runCommand("whoami", registry, makeContext()))).toContain("ada@portfolio");
	});

	it("reports unknown commands and suggests close matches", () => {
		const text = resultToString(runCommand("projcts", registry, makeContext()));
		expect(text).toContain("command not found: projcts");
		expect(text).toContain("Did you mean 'projects'?");
	});

	it("points to help when nothing is close", () => {
		expect(resultToString(runCommand("zzzzzz", registry, makeContext()))).toContain("Type 'help'");
	});

	it("turns a throwing command into an error line instead of throwing", () => {
		const broken: Command = {
			name: "boom",
			describe: () => "boom",
			run: () => {
				throw new Error("nope");
			},
		};
		const result = runCommand("boom", createRegistry([broken]), makeContext());
		expect(resultToString(result)).toContain("Something went wrong");
	});

	it("survives hostile input", () => {
		for (const raw of ['"', "'''", "\u0000", "a".repeat(5000), "projects --tag", "projects --tag=", "   -f   "]) {
			expect(() => runCommand(raw, registry, makeContext())).not.toThrow();
		}
	});
});
