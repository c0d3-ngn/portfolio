import { describe, expect, it } from "vitest";
import { createRegistry } from "./registry";
import type { Command } from "./types";

function fakeCommand(name: string, extra: Partial<Command> = {}): Command {
	return { name, describe: () => name, run: () => ({ output: [] }), ...extra };
}

describe("createRegistry", () => {
	const registry = createRegistry([
		fakeCommand("help", { aliases: ["?"] }),
		fakeCommand("neofetch", { aliases: ["whoami", "info"] }),
		fakeCommand("sudo", { hidden: true }),
	]);

	it("resolves commands by name and by alias", () => {
		expect(registry.resolve("help")?.name).toBe("help");
		expect(registry.resolve("?")?.name).toBe("help");
		expect(registry.resolve("whoami")?.name).toBe("neofetch");
	});

	it("resolves hidden commands but does not list them", () => {
		expect(registry.resolve("sudo")?.name).toBe("sudo");
		expect(registry.visible().map((command) => command.name)).toEqual(["help", "neofetch"]);
		expect(registry.names()).not.toContain("sudo");
	});

	it("lists names together with aliases for completion", () => {
		expect(registry.names()).toEqual(["help", "?", "neofetch", "whoami", "info"]);
	});

	it("returns undefined for unknown names", () => {
		expect(registry.resolve("nope")).toBeUndefined();
	});

	it("rejects duplicate names or aliases", () => {
		expect(() => createRegistry([fakeCommand("a"), fakeCommand("a")])).toThrow(/Duplicate/);
		expect(() => createRegistry([fakeCommand("a", { aliases: ["x"] }), fakeCommand("b", { aliases: ["x"] })])).toThrow(
			/"x"/,
		);
	});
});
