import { MotionConfig, motion, useInView, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "./use-hydrated-reduced-motion";

export interface CareerEntryData {
	id: string;
	role: string;
	company: string;
	location?: string;
	period: string;
	html: string;
	stack: string[];
	current: boolean;
}

interface CareerTimelineProps {
	entries: CareerEntryData[];
	nowLabel: string;
}

const PROGRESS_SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 } as const;

interface TimelineItemProps {
	entry: CareerEntryData;
	nowLabel: string;
}

function TimelineItem({ entry, nowLabel }: TimelineItemProps) {
	const ref = useRef<HTMLLIElement>(null);
	const reached = useInView(ref, { margin: "0px 0px -55% 0px" });

	return (
		<motion.li
			ref={ref}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px 0px -10% 0px" }}
			transition={{ type: "spring", stiffness: 140, damping: 24 }}
			className="relative gap-8 pb-12 last:pb-0 md:grid md:grid-cols-[9rem_1fr]"
		>
			<span
				aria-hidden="true"
				className={cn(
					"absolute top-1.5 -left-8 h-3.5 w-3.5 rounded-full border-2 bg-ground transition-colors duration-500",
					reached ? "border-accent bg-accent shadow-[0_0_16px_2px_rgb(232_80_58/50%)]" : "border-rule",
				)}
			/>

			<p className="flex items-center gap-3 font-mono text-sm text-ink-mute md:sticky md:top-28 md:self-start">
				{entry.period}
				{entry.current && (
					<span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[0.6875rem] tracking-widest text-accent uppercase">
						{nowLabel}
					</span>
				)}
			</p>

			<div className="glow-card mt-3 p-6 sm:p-8 md:mt-0">
				<h3 className="font-display text-h2 leading-tight text-ink">{entry.role}</h3>
				<p className="mt-1 text-ink-mute">
					<span className="text-ink">{entry.company}</span>
					{entry.location ? ` — ${entry.location}` : ""}
				</p>

				<div
					className="mt-4 max-w-2xl text-ink-mute"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is rendered from first-party markdown at build time
					dangerouslySetInnerHTML={{ __html: entry.html }}
				/>

				{entry.stack.length > 0 && (
					<ul className="mt-5 flex flex-wrap gap-2">
						{entry.stack.map((tech) => (
							<li
								key={tech}
								className="rounded-full border border-rule bg-ground/60 px-3 py-1 font-mono text-xs text-ink-mute"
							>
								{tech}
							</li>
						))}
					</ul>
				)}
			</div>
		</motion.li>
	);
}

/**
 * Vertical career timeline whose accent line fills as the list scrolls through the viewport.
 * Hydrate with `client:visible`.
 */
export default function CareerTimeline({ entries, nowLabel }: CareerTimelineProps) {
	const listRef = useRef<HTMLOListElement>(null);
	const reduceMotion = useHydratedReducedMotion();
	const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
	const progress = useSpring(scrollYProgress, PROGRESS_SPRING);

	return (
		<MotionConfig reducedMotion="user">
			<ol ref={listRef} className="relative ml-8">
				<span aria-hidden="true" className="absolute top-2 -bottom-2 -left-[25px] w-px bg-rule" />
				<motion.span
					aria-hidden="true"
					style={{ scaleY: reduceMotion ? 1 : progress }}
					className="absolute top-2 -bottom-2 -left-[25px] w-px origin-top bg-accent"
				/>
				{entries.map((entry) => (
					<TimelineItem key={entry.id} entry={entry} nowLabel={nowLabel} />
				))}
			</ol>
		</MotionConfig>
	);
}
