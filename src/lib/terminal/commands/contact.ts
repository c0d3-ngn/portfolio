import { BLANK_LINE, hangingLabel, linesResult, segment, textLine } from "../output";
import type { Command } from "../types";

export const contactCommand: Command = {
	name: "contact",
	describe: (t) => t.descriptions.contact,
	run(_input, { data, t }) {
		const labelWidth = Math.max(t.contact.email.length, ...data.socials.map((social) => social.label.length)) + 2;
		const label = (text: string) => hangingLabel(text, labelWidth);

		return linesResult(
			textLine(t.contact.header, "accent"),
			BLANK_LINE,
			[label(t.contact.email), segment(data.email, "ink", `mailto:${data.email}`)],
			...data.socials.map((social) => [label(social.label), segment(social.url, "ink", social.url)]),
		);
	},
};
