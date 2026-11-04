import { fill } from "../../../i18n/terminal";
import { LOCALE_LABELS, LOCALES } from "../../../i18n/ui";
import { linesResult, textLine } from "../output";
import type { Command } from "../types";
import { usageError } from "./shared";

export const langCommand: Command = {
	name: "lang",
	describe: (t) => t.descriptions.lang,
	usage: (t) => t.usages.lang,
	run({ args }, { data, t }) {
		const [requested] = args;
		if (!requested) return usageError(t, t.usages.lang);

		const target = LOCALES.find((locale) => locale === requested.toLowerCase());
		if (!target) return linesResult(textLine(fill(t.lang.unknown, { lang: requested }), "warn"));

		const language = LOCALE_LABELS[target];
		if (target === data.locale) return linesResult(textLine(fill(t.lang.already, { language }), "mute"));

		return {
			output: [{ kind: "lines", lines: [textLine(fill(t.lang.switching, { language }), "mute")] }],
			action: { type: "navigate", href: data.links.alternate },
		};
	},
};
