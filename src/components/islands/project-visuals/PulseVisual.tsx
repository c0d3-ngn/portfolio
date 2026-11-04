import { motion } from "motion/react";
import { useVisualState } from "./use-visual-state";

const BASELINE_Y = 150;
const BEAT_STARTS = [24, 126, 228] as const;
const LINE_END_X = 376;

const readouts = [
	{ label: "HR", value: "72", unit: "bpm" },
	{ label: "SpO2", value: "98", unit: "%" },
	{ label: "BP", value: "120/80", unit: "mmHg" },
] as const;

function beat(x: number): string {
	return `H${x + 24} l5 -5 l5 5 H${x + 46} l4 7 l6 -58 l6 70 l4 -19 H${x + 86} l8 -11 l8 11`;
}

const ECG_PATH = `M24 ${BASELINE_Y} ${BEAT_STARTS.map(beat).join(" ")} H${LINE_END_X}`;
const GLOW = { filter: "drop-shadow(0 0 5px rgb(232 80 58 / 85%))" } as const;

/**
 * Patient-monitor illustration: vitals readouts above a looping ECG trace.
 */
export default function PulseVisual() {
	const { ref, loops } = useVisualState<SVGSVGElement>();

	return (
		<svg ref={ref} viewBox="0 0 400 220" aria-hidden="true" className="absolute inset-0 z-1 h-full w-full">
			{[70, 110, 150, 190].map((y) => (
				<line key={y} x1="24" x2={LINE_END_X} y1={y} y2={y} className="stroke-rule/50" strokeDasharray="2 6" />
			))}

			{readouts.map((readout, index) => (
				<g key={readout.label} transform={`translate(${24 + index * 122} 22)`}>
					<rect width="108" height="44" rx="10" className="fill-surface/90 stroke-rule" />
					<text x="12" y="17" className="fill-ink-mute font-mono text-[9px] tracking-widest">
						{readout.label}
					</text>
					<text x="12" y="36" className="fill-ink font-display text-[17px]">
						{readout.value}
					</text>
					<text x="96" y="36" textAnchor="end" className="fill-ink-mute font-mono text-[8px]">
						{readout.unit}
					</text>
				</g>
			))}

			<path d={ECG_PATH} fill="none" className="stroke-rule" strokeWidth="1.5" strokeLinejoin="round" />
			<motion.path
				d={ECG_PATH}
				fill="none"
				className="stroke-accent"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={GLOW}
				initial={false}
				animate={loops ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] } : { pathLength: 1, opacity: 1 }}
				transition={
					loops
						? { duration: 3.4, times: [0, 0.7, 1], ease: "linear", repeat: Number.POSITIVE_INFINITY }
						: { duration: 0 }
				}
			/>
		</svg>
	);
}
