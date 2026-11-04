import type { ArgumentCandidates } from "../completion";
import type { Command } from "../types";
import { aboutCommand } from "./about";
import { careerCommand } from "./career";
import { clearCommand } from "./clear";
import { contactCommand } from "./contact";
import {
	coffeeCommand,
	jokeCommand,
	lsCommand,
	matrixCommand,
	pwdCommand,
	rmCommand,
	sudoCommand,
	vimCommand,
} from "./easter-eggs";
import { helpCommand } from "./help";
import { langCommand } from "./lang";
import { exitCommand, modeCommand } from "./mode";
import { neofetchCommand } from "./neofetch";
import { projectsCommand } from "./projects";
import { dateCommand, echoCommand, historyCommand } from "./utilities";

/**
 * Every terminal command. To add one, create a `Command` and list it here; `help`, Tab completion
 * and "did you mean" pick it up automatically (unless it is `hidden`).
 */
export const commands: Command[] = [
	helpCommand,
	neofetchCommand,
	aboutCommand,
	projectsCommand,
	careerCommand,
	contactCommand,
	clearCommand,
	modeCommand,
	langCommand,
	historyCommand,
	echoCommand,
	dateCommand,
	exitCommand,
	sudoCommand,
	matrixCommand,
	coffeeCommand,
	jokeCommand,
	lsCommand,
	pwdCommand,
	rmCommand,
	vimCommand,
];

export const argumentCandidates: ArgumentCandidates = {
	mode: ["preview"],
	lang: ["en", "es"],
	projects: ["--featured", "--tag", "--stack"],
	career: ["--current"],
};
