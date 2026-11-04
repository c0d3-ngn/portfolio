import { describe, expect, it } from "vitest";
import { complete } from "./completion";

const names = ["help", "?", "neofetch", "whoami", "projects", "career", "clear", "contact", "mode"];
const args = { mode: ["preview"], projects: ["--featured", "--tag", "--stack"] };

describe("complete", () => {
	it("completes a unique command with a trailing space", () => {
		expect(complete("proj", names)).toEqual({ completed: "projects ", options: [] });
	});

	it("completes to the common prefix and lists the options when ambiguous", () => {
		expect(complete("c", names)).toEqual({ completed: "c", options: ["career", "clear", "contact"] });
		expect(complete("cl", names)).toEqual({ completed: "clear ", options: [] });
	});

	it("leaves unknown input untouched", () => {
		expect(complete("zzz", names)).toEqual({ completed: "zzz", options: [] });
	});

	it("lists every command for empty input", () => {
		expect(complete("", names).options).toEqual(names);
	});

	it("completes arguments for commands that declare candidates", () => {
		expect(complete("mode p", names, args)).toEqual({ completed: "mode preview ", options: [] });
		expect(complete("projects --f", names, args)).toEqual({ completed: "projects --featured ", options: [] });
		expect(complete("projects --", names, args).options).toEqual(["--featured", "--tag", "--stack"]);
	});

	it("does nothing for arguments of commands without candidates", () => {
		expect(complete("about x", names, args)).toEqual({ completed: "about x", options: [] });
	});
});
