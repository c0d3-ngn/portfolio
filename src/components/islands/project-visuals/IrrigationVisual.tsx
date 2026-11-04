import { motion } from "motion/react";
import { useVisualState } from "./use-visual-state";

const MOISTURE_LEVEL = 0.62;
const SOIL_Y = 112;
const GAUGE_RADIUS = 46;
const GAUGE_CENTER = { x: 112, y: 112 };

const rootPaths = [
	{ d: "M292 112 C290 134 294 154 290 184", width: 2.4 },
	{ d: "M291 132 C274 134 264 142 256 156", width: 1.8 },
	{ d: "M292 146 C308 148 318 158 324 172", width: 1.8 },
	{ d: "M290 166 C280 168 274 174 270 184", width: 1.2 },
] as const;

const droplets = [244, 292, 340] as const;

/**
 * Irrigation illustration: soil-moisture gauge beside roots that grow in as drops fall.
 */
export default function IrrigationVisual() {
	const { ref, loops, animated } = useVisualState<SVGSVGElement>();

	return (
		<svg ref={ref} viewBox="0 0 400 220" aria-hidden="true" className="absolute inset-0 z-1 h-full w-full">
			<circle
				cx={GAUGE_CENTER.x}
				cy={GAUGE_CENTER.y}
				r={GAUGE_RADIUS}
				fill="none"
				className="stroke-rule"
				strokeWidth="8"
			/>
			<motion.circle
				cx={GAUGE_CENTER.x}
				cy={GAUGE_CENTER.y}
				r={GAUGE_RADIUS}
				fill="none"
				className="stroke-accent"
				strokeWidth="8"
				strokeLinecap="round"
				style={{
					rotate: -90,
					transformBox: "fill-box",
					transformOrigin: "center",
					filter: "drop-shadow(0 0 5px rgb(232 80 58 / 70%))",
				}}
				initial={{ pathLength: animated ? 0 : MOISTURE_LEVEL }}
				animate={{ pathLength: loops || !animated ? MOISTURE_LEVEL : 0 }}
				transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
			/>
			<text x={GAUGE_CENTER.x} y={GAUGE_CENTER.y + 8} textAnchor="middle" className="fill-ink font-display text-[26px]">
				{Math.round(MOISTURE_LEVEL * 100)}%
			</text>
			<text
				x={GAUGE_CENTER.x}
				y={GAUGE_CENTER.y + 26}
				textAnchor="middle"
				className="fill-ink-mute font-mono text-[9px]"
			>
				H2O
			</text>

			<line x1="214" x2="372" y1={SOIL_Y} y2={SOIL_Y} className="stroke-rule" strokeDasharray="3 5" />

			{rootPaths.map((root, index) => (
				<motion.path
					key={root.d}
					d={root.d}
					fill="none"
					className="stroke-accent"
					strokeWidth={root.width}
					strokeLinecap="round"
					initial={{ pathLength: animated ? 0 : 1 }}
					animate={{ pathLength: loops || !animated ? 1 : 0 }}
					transition={{ duration: 2.2, delay: index * 0.25, ease: "easeInOut" }}
				/>
			))}

			{animated &&
				droplets.map((x, index) => (
					<motion.circle
						key={x}
						cx={x}
						cy="62"
						r="3"
						className="fill-ink-mute"
						initial={{ opacity: 0 }}
						animate={loops ? { y: [0, 44], opacity: [0, 1, 0] } : { opacity: 0 }}
						transition={
							loops
								? {
										duration: 1.6,
										delay: index * 0.5,
										ease: "easeIn",
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: 0.6,
									}
								: { duration: 0 }
						}
					/>
				))}
		</svg>
	);
}
