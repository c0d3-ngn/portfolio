interface QuickCommandsProps {
	commands: readonly string[];
	label: string;
	onRun: (command: string) => void;
}

/**
 * Tappable shortcuts for the main commands, so touch users never need the on-screen keyboard.
 */
export default function QuickCommands({ commands, label, onRun }: QuickCommandsProps) {
	return (
		<div
			role="toolbar"
			aria-label={label}
			className="flex gap-2 overflow-x-auto border-t border-rule px-4 py-2 sm:px-6"
		>
			{commands.map((command) => (
				<button
					key={command}
					type="button"
					onClick={() => onRun(command)}
					className="inline-flex h-11 shrink-0 items-center rounded-full border border-rule bg-surface/60 px-4 font-mono text-sm text-ink-mute transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					{command}
				</button>
			))}
		</div>
	);
}
