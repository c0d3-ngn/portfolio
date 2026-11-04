import type { Block, Line, Segment, Tone } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<Tone, string> = {
	ink: "text-ink",
	mute: "text-ink-mute",
	accent: "text-accent",
	ok: "text-ok",
	warn: "text-warn",
};

const STAGGER_MS = 22;
const MAX_STAGGERED_LINES = 24;

interface Keyed<T> {
	key: string;
	item: T;
	position: number;
}

/** Pairs each item with a stable key: its content plus how many identical items came before it. */
function withKeys<T>(items: T[], describe: (item: T) => string): Keyed<T>[] {
	const seen = new Map<string, number>();
	return items.map((item, position) => {
		const base = describe(item);
		const occurrence = seen.get(base) ?? 0;
		seen.set(base, occurrence + 1);
		return { key: `${base}#${occurrence}`, item, position };
	});
}

const describeLine = (line: Line) => line.map((part) => part.text).join("");

function SegmentView({ segment }: { segment: Segment }) {
	const className = cn(segment.tone && TONE_CLASSES[segment.tone]);
	if (!segment.href) return <span className={className}>{segment.text}</span>;

	const isExternal = segment.href.startsWith("http");
	return (
		<a
			href={segment.href}
			{...(isExternal && { target: "_blank", rel: "noreferrer noopener" })}
			className={cn(
				className,
				"underline decoration-rule underline-offset-4 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-accent",
			)}
		>
			{segment.text}
		</a>
	);
}

interface LineViewProps {
	line: Line;
	order: number;
	preserveSpace?: boolean;
}

function hangingIndent(line: Line): number {
	const end = line.findIndex((segment) => segment.hanging);
	return end === -1 ? 0 : line.slice(0, end + 1).reduce((width, segment) => width + segment.text.length, 0);
}

function LineView({ line, order, preserveSpace = false }: LineViewProps) {
	const isBlank = line.every((segment) => segment.text === "");
	const indent = hangingIndent(line);
	return (
		<div
			className={cn(
				"terminal-line min-h-[1.5em]",
				preserveSpace ? "whitespace-pre" : "whitespace-pre-wrap break-words",
			)}
			style={{
				animationDelay: `${Math.min(order, MAX_STAGGERED_LINES) * STAGGER_MS}ms`,
				...(indent > 0 && { paddingLeft: `${indent}ch`, textIndent: `-${indent}ch` }),
			}}
		>
			{isBlank
				? " "
				: withKeys(line, (part) => `${part.tone ?? ""}:${part.text}`).map(({ key, item }) => (
						<SegmentView key={key} segment={item} />
					))}
		</div>
	);
}

function LineList({ lines, preserveSpace }: { lines: Line[]; preserveSpace?: boolean }) {
	return (
		<>
			{withKeys(lines, describeLine).map(({ key, item, position }) => (
				<LineView key={key} line={item} order={position} preserveSpace={preserveSpace} />
			))}
		</>
	);
}

const describeBlock = (block: Block) =>
	`${block.kind}:${describeLine((block.kind === "lines" ? block.lines : block.main)[0] ?? [])}`;

/**
 * Renders command output. A `split` block shows its aside (the logo) beside the main lines from
 * the `sm` breakpoint up, and hides it below, where the line would not fit.
 */
export function OutputBlocks({ blocks }: { blocks: Block[] }) {
	return (
		<>
			{withKeys(blocks, describeBlock).map(({ key, item: block }) =>
				block.kind === "lines" ? (
					<div key={key}>
						<LineList lines={block.lines} />
					</div>
				) : (
					<div key={key} className="flex flex-col gap-x-8 gap-y-3 sm:flex-row">
						<div aria-hidden="true" className="hidden shrink-0 sm:block">
							<LineList lines={block.aside} preserveSpace />
						</div>
						<div className="min-w-0">
							<LineList lines={block.main} />
						</div>
					</div>
				),
			)}
		</>
	);
}
