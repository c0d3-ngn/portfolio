import { type KeyboardEvent, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { TerminalStrings } from "@/i18n/terminal";
import { hasPrecisePointer, prefersReducedMotion } from "@/lib/motion";
import { argumentCandidates, commands } from "@/lib/terminal/commands";
import { complete } from "@/lib/terminal/completion";
import { navigateHistory, pushHistory } from "@/lib/terminal/history";
import { linesBlock, textLine } from "@/lib/terminal/output";
import { createRegistry } from "@/lib/terminal/registry";
import { runCommand } from "@/lib/terminal/run";
import type { Block, TerminalData } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";
import { OutputBlocks } from "./OutputLine";
import QuickCommands from "./QuickCommands";

const MatrixRain = lazy(() => import("./MatrixRain"));

interface TerminalProps {
	data: TerminalData;
	strings: TerminalStrings;
	className?: string;
}

interface Entry {
	id: number;
	command?: string;
	output: Block[];
}

type Phase = "pending" | "booting" | "ready";

const registry = createRegistry(commands);
const COMMAND_NAMES = registry.names();
const QUICK_COMMANDS = ["help", "neofetch", "projects", "career", "contact"] as const;
const WELCOME_COMMAND = "neofetch";

const BOOT_LINE_DELAY_MS = 260;
const BOOT_PAUSE_MS = 320;
const TYPE_DELAY_MS = 55;
const NAVIGATE_DELAY_MS = 450;
const BOOTED_STORAGE_KEY = "terminal-booted";

function hasBootedThisSession(): boolean {
	try {
		return sessionStorage.getItem(BOOTED_STORAGE_KEY) === "1";
	} catch {
		return false;
	}
}

function rememberBoot(): void {
	try {
		sessionStorage.setItem(BOOTED_STORAGE_KEY, "1");
	} catch {
		return;
	}
}

async function goTo(href: string): Promise<void> {
	try {
		const { navigate } = await import("astro:transitions/client");
		navigate(href);
	} catch {
		window.location.assign(href);
	}
}

function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function PromptLine({ command, caret = false }: { command: string; caret?: boolean }) {
	return (
		<div className="whitespace-pre-wrap break-all">
			<span className="text-accent">$ </span>
			<span className="text-ink">{command}</span>
			{caret && <span aria-hidden="true" className="terminal-caret" />}
		</div>
	);
}

function BootLine({ line }: { line: string }) {
	const match = /^(.*\s…\s)ok$/.exec(line);
	return (
		<div className="terminal-line text-ink-mute">
			{match ? (
				<>
					{match[1]}
					<span className="text-ok">ok</span>
				</>
			) : (
				line
			)}
		</div>
	);
}

/**
 * Interactive terminal for the dev mode: boot sequence, command line with history and Tab
 * completion, and a registry of simulated commands. Nothing here executes real code; output is
 * always rendered as text. Hydrate with `client:load`.
 */
export default function Terminal({ data, strings, className }: TerminalProps) {
	const [phase, setPhase] = useState<Phase>("pending");
	const [bootLines, setBootLines] = useState<string[]>([]);
	const [typed, setTyped] = useState("");
	const [entries, setEntries] = useState<Entry[]>([]);
	const [value, setValue] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyCursor, setHistoryCursor] = useState<number | null>(null);
	const [matrixActive, setMatrixActive] = useState(false);

	const draft = useRef("");
	const nextId = useRef(0);
	const skipBoot = useRef(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const runIntoEntry = useCallback(
		(raw: string, currentHistory: string[]): Entry => {
			const result = runCommand(raw, registry, {
				data,
				t: strings,
				history: currentHistory,
				random: Math.random,
				now: () => new Date(),
			});
			return { id: nextId.current++, command: raw, output: result.output };
		},
		[data, strings],
	);

	const finishBoot = useCallback(() => {
		rememberBoot();
		setBootLines([]);
		setTyped("");
		setEntries([runIntoEntry(WELCOME_COMMAND, [])]);
		setPhase("ready");
	}, [runIntoEntry]);

	useEffect(() => {
		if (prefersReducedMotion() || hasBootedThisSession()) {
			finishBoot();
			return;
		}

		setPhase("booting");
		skipBoot.current = false;
		let cancelled = false;
		const aborted = () => cancelled || skipBoot.current;

		(async () => {
			for (const line of strings.boot) {
				await sleep(BOOT_LINE_DELAY_MS);
				if (aborted()) return;
				setBootLines((current) => [...current, line]);
			}
			await sleep(BOOT_PAUSE_MS);
			for (let length = 1; length <= WELCOME_COMMAND.length; length++) {
				if (aborted()) return;
				setTyped(WELCOME_COMMAND.slice(0, length));
				await sleep(TYPE_DELAY_MS);
			}
			await sleep(BOOT_PAUSE_MS);
			if (aborted()) return;
			finishBoot();
		})();

		return () => {
			cancelled = true;
		};
	}, [finishBoot, strings.boot]);

	useEffect(() => {
		if (phase !== "booting") return;

		const skip = (event: Event) => {
			event.preventDefault();
			skipBoot.current = true;
			finishBoot();
		};
		window.addEventListener("keydown", skip, { capture: true });
		window.addEventListener("pointerdown", skip, { capture: true });
		return () => {
			window.removeEventListener("keydown", skip, { capture: true });
			window.removeEventListener("pointerdown", skip, { capture: true });
		};
	}, [phase, finishBoot]);

	useEffect(() => {
		if (phase === "ready" && hasPrecisePointer()) inputRef.current?.focus({ preventScroll: true });
	}, [phase]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scrolls whenever any visible output changes
	useEffect(() => {
		const container = scrollRef.current;
		if (container) container.scrollTop = container.scrollHeight;
	}, [entries, bootLines, typed, phase]);

	const closeMatrix = useCallback(() => setMatrixActive(false), []);

	const execute = useCallback(
		(raw: string) => {
			const trimmed = raw.trim();
			if (!trimmed) return;

			const nextHistory = pushHistory(history, trimmed);
			setHistory(nextHistory);
			setHistoryCursor(null);
			draft.current = "";

			const result = runCommand(trimmed, registry, {
				data,
				t: strings,
				history: nextHistory,
				random: Math.random,
				now: () => new Date(),
			});
			const output = [...result.output];

			if (result.action?.type === "clear") {
				setEntries([]);
				return;
			}
			if (result.action?.type === "matrix") {
				if (prefersReducedMotion()) output.push(linesBlock(textLine(strings.eggs.matrixReduced, "mute")));
				else setMatrixActive(true);
			}
			if (result.action?.type === "navigate") {
				const href = result.action.href;
				window.setTimeout(() => void goTo(href), NAVIGATE_DELAY_MS);
			}

			setEntries((current) => [...current, { id: nextId.current++, command: trimmed, output }]);
		},
		[data, history, strings],
	);

	const submitFromInput = () => {
		execute(value);
		setValue("");
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			submitFromInput();
			return;
		}

		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();
			if (historyCursor === null) draft.current = value;
			const step = navigateHistory(history, historyCursor, event.key === "ArrowUp" ? "up" : "down");
			setHistoryCursor(step.cursor);
			setValue(step.value ?? draft.current);
			return;
		}

		if (event.key === "Tab") {
			event.preventDefault();
			const completion = complete(value, COMMAND_NAMES, argumentCandidates);
			setValue(completion.completed);
			if (completion.options.length > 1) {
				setEntries((current) => [
					...current,
					{
						id: nextId.current++,
						command: value,
						output: [linesBlock(textLine(completion.options.join("  "), "mute"))],
					},
				]);
			}
			return;
		}

		if (event.ctrlKey && event.key.toLowerCase() === "l") {
			event.preventDefault();
			setEntries([]);
			return;
		}

		if (event.ctrlKey && event.key.toLowerCase() === "c") {
			event.preventDefault();
			setEntries((current) => [...current, { id: nextId.current++, command: `${value}^C`, output: [] }]);
			setValue("");
			setHistoryCursor(null);
		}
	};

	const focusInput = () => {
		if (!hasPrecisePointer() || window.getSelection()?.toString()) return;
		inputRef.current?.focus({ preventScroll: true });
	};

	return (
		<div
			className={cn(
				"relative flex min-h-0 w-full max-w-4xl flex-col self-center overflow-hidden rounded-2xl border border-rule bg-ground/90 shadow-[0_24px_80px_-24px_rgb(0_0_0/80%)] backdrop-blur",
				className,
			)}
		>
			<div className="flex items-center gap-3 border-b border-rule px-4 py-3 font-mono text-xs text-ink-mute sm:px-6">
				<span aria-hidden="true" className="flex gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full bg-rule" />
					<span className="h-2.5 w-2.5 rounded-full bg-rule" />
					<span className="h-2.5 w-2.5 rounded-full bg-accent" />
				</span>
				<span>{strings.windowTitle}</span>
				{phase === "booting" && <span className="ml-auto">{strings.skipHint}</span>}
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: the click only forwards focus to the real input, which is keyboard reachable */}
			<div
				ref={scrollRef}
				role="log"
				aria-live="polite"
				aria-label={strings.outputLabel}
				aria-busy={phase !== "ready"}
				onClick={focusInput}
				className="terminal-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4 font-mono text-sm leading-relaxed text-ink sm:px-6"
			>
				{bootLines.map((line) => (
					<BootLine key={line} line={line} />
				))}
				{phase === "booting" && typed && <PromptLine command={typed} caret />}

				{entries.map((entry) => (
					<div key={entry.id} className="mb-4">
						{entry.command !== undefined && <PromptLine command={entry.command} />}
						<OutputBlocks blocks={entry.output} />
					</div>
				))}

				{phase === "ready" && (
					<form
						onSubmit={(event) => {
							event.preventDefault();
							submitFromInput();
						}}
						className="flex items-center gap-2"
					>
						<span aria-hidden="true" className="text-accent">
							$
						</span>
						<label htmlFor="terminal-input" className="sr-only">
							{strings.inputLabel}
						</label>
						<input
							id="terminal-input"
							ref={inputRef}
							value={value}
							onChange={(event) => setValue(event.target.value)}
							onKeyDown={handleKeyDown}
							maxLength={200}
							autoCapitalize="off"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							enterKeyHint="send"
							className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-ink caret-accent outline-none"
						/>
					</form>
				)}
			</div>

			{phase === "ready" && (
				<QuickCommands
					commands={QUICK_COMMANDS}
					label={strings.quickCommandsLabel}
					onRun={(command) => {
						execute(command);
						if (hasPrecisePointer()) inputRef.current?.focus({ preventScroll: true });
					}}
				/>
			)}

			{matrixActive && (
				<Suspense fallback={null}>
					<MatrixRain onDone={closeMatrix} />
				</Suspense>
			)}
		</div>
	);
}
