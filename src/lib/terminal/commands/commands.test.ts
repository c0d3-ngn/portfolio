import { describe, expect, it } from "vitest";
import { terminalStrings } from "../../../i18n/terminal";
import { LOCALES } from "../../../i18n/ui";
import { makeContext } from "../fixtures";
import { resultToString } from "../output";
import { parseInput } from "../parser";
import { createRegistry } from "../registry";
import { argumentCandidates, commands } from "./index";

const registry = createRegistry(commands);

function run(raw: string, locale: "en" | "es" = "en", random?: () => number) {
	const command = registry.resolve(parseInput(raw).name);
	if (!command) throw new Error(`unknown command in test: ${raw}`);
	return command.run(parseInput(raw), makeContext({ locale, visibleCommands: registry.visible(), random }));
}

describe("command registry", () => {
	it("registers without name clashes", () => {
		expect(registry.visible().length).toBeGreaterThan(8);
	});

	it("describes every visible command in every locale", () => {
		for (const locale of LOCALES) {
			for (const command of registry.visible()) {
				expect(command.describe(terminalStrings[locale]).length).toBeGreaterThan(0);
			}
		}
	});

	it("keeps easter eggs out of help and completion", () => {
		const names = registry.names();
		for (const hidden of ["sudo", "matrix", "coffee", "joke", "ls", "pwd", "rm", "vim", "exit"]) {
			expect(names).not.toContain(hidden);
			expect(registry.resolve(hidden)).toBeDefined();
		}
	});

	it("only offers argument candidates for real commands", () => {
		for (const name of Object.keys(argumentCandidates)) expect(registry.resolve(name)).toBeDefined();
	});

	it("runs every command on the fixture without throwing, in both locales", () => {
		for (const locale of LOCALES) {
			for (const command of [
				"help",
				"neofetch",
				"about",
				"projects",
				"career",
				"contact",
				"history",
				"date",
				"echo hi",
			]) {
				expect(() => run(command, locale)).not.toThrow();
			}
		}
	});
});

describe("help", () => {
	it("lists visible commands with their aliases", () => {
		const text = resultToString(run("help"));
		expect(text).toContain("neofetch");
		expect(text).toContain("whoami");
		expect(text).not.toContain("sudo");
	});
});

describe("about", () => {
	it("prints every paragraph", () => {
		expect(resultToString(run("about"))).toBe("First paragraph.\n\nSecond paragraph.");
	});
});

describe("projects", () => {
	it("lists numbered projects with a featured marker", () => {
		const text = resultToString(run("projects"));
		expect(text).toContain("2 projects");
		expect(text).toContain("01  Analytical Engine  ★");
		expect(text).toContain("02  Notes");
	});

	it("filters by tag, stack and featured while keeping stable numbers", () => {
		expect(resultToString(run("projects --tag writing"))).toContain("02  Notes");
		expect(resultToString(run("projects --tag writing"))).not.toContain("Analytical");
		expect(resultToString(run("projects --stack python"))).toContain("1 of 2 projects");
		expect(resultToString(run("projects -f"))).toContain("Analytical Engine");
	});

	it("shows details by number or partial name", () => {
		const byNumber = resultToString(run("projects 1"));
		expect(byNumber).toContain("A mechanical computer.");
		expect(byNumber).toContain("https://github.com/ada/engine");
		expect(resultToString(run("projects notes"))).toContain("https://example.com/notes");
	});

	it("reports unknown projects and bad flags without throwing", () => {
		expect(resultToString(run("projects 9"))).toContain("No project matches '9'");
		expect(resultToString(run("projects --tag nothing"))).toContain("No project matches");
		expect(resultToString(run("projects --bogus"))).toContain("usage:");
	});

	it("localizes output", () => {
		expect(resultToString(run("projects", "es"))).toContain("2 proyectos");
	});
});

describe("career", () => {
	it("lists entries newest first as given, flagging the current one", () => {
		const text = resultToString(run("career"));
		expect(text).toContain("Mathematician");
		expect(text).toContain("● now");
		expect(text).toContain("Student");
	});

	it("shows only the current role with --current", () => {
		const text = resultToString(run("career --current"));
		expect(text).toContain("Mathematician");
		expect(text).not.toContain("Student");
	});

	it("rejects stray arguments", () => {
		expect(resultToString(run("career nonsense"))).toContain("usage:");
	});

	it("is reachable through its alias", () => {
		expect(registry.resolve("experience")?.name).toBe("career");
	});
});

describe("contact", () => {
	it("links the email and socials", () => {
		const result = run("contact");
		const segments = result.output.flatMap((block) => (block.kind === "lines" ? block.lines.flat() : []));
		expect(segments.find((part) => part.href === "mailto:ada@example.com")).toBeDefined();
		expect(segments.find((part) => part.href === "https://github.com/ada")).toBeDefined();
	});
});

describe("navigation commands", () => {
	it("mode preview navigates to the preview route of the same locale", () => {
		expect(run("mode preview").action).toEqual({ type: "navigate", href: "/" });
		expect(run("mode preview", "es").action).toEqual({ type: "navigate", href: "/es/" });
		expect(run("exit", "es").action).toEqual({ type: "navigate", href: "/es/" });
	});

	it("mode rejects missing or unknown targets", () => {
		expect(run("mode").action).toBeUndefined();
		expect(resultToString(run("mode"))).toContain("usage:");
		expect(resultToString(run("mode dev"))).toContain("Unknown mode 'dev'");
	});

	it("lang switches to the other locale and ignores the current one", () => {
		expect(run("lang es").action).toEqual({ type: "navigate", href: "/es/dev" });
		expect(run("lang en").action).toBeUndefined();
		expect(resultToString(run("lang en"))).toContain("Already using English");
		expect(resultToString(run("lang fr"))).toContain("Unknown language 'fr'");
	});

	it("clear returns the clear action", () => {
		expect(run("clear").action).toEqual({ type: "clear" });
	});
});

describe("utilities", () => {
	it("echo prints its arguments", () => {
		expect(resultToString(run("echo hello   world"))).toBe("hello world");
		expect(resultToString(run("echo"))).toBe("");
	});

	it("history numbers the previous commands", () => {
		const command = registry.resolve("history");
		const result = command?.run(parseInput("history"), makeContext({ history: ["help", "about"] }));
		expect(result && resultToString(result)).toBe("  1  help\n  2  about");
	});
});

describe("easter eggs", () => {
	it("sudo is denied", () => {
		expect(resultToString(run("sudo rm -rf /"))).toContain("sudoers");
	});

	it("matrix triggers the matrix action", () => {
		expect(run("matrix").action).toEqual({ type: "matrix" });
	});

	it("joke picks deterministically from the injected random source", () => {
		expect(resultToString(run("joke", "en", () => 0))).toContain("10 types of people");
		expect(resultToString(run("joke", "en", () => 0.999))).toContain("ship your machine");
	});

	it("ls lists sections as directories", () => {
		expect(resultToString(run("ls"))).toContain("projects/");
	});
});
