import { FileText } from "lucide-react";
import { motion } from "motion/react";
import { useVisualState } from "./use-visual-state";

const BASELINE_Y = 176;
const BAR_WIDTH = 30;
const BAR_GAP = 24;
const FIRST_BAR_X = 50;
const BAR_HEIGHTS = [96, 128, 64, 112, 80, 56] as const;
const SCAN_RANGE_PX = 300;

/**
 * Vote-tally illustration: bars rise per census zone while a scan line sweeps across them, next to
 * the PDF the tool produces.
 */
export default function TallyVisual() {
	const { ref, loops, animated } = useVisualState<SVGSVGElement>();

	return (
		<svg ref={ref} viewBox="0 0 400 220" aria-hidden="true" className="absolute inset-0 z-1 h-full w-full">
			{[56, 96, 136].map((y) => (
				<line key={y} x1="36" x2="364" y1={y} y2={y} className="stroke-rule/50" strokeDasharray="2 6" />
			))}
			<line x1="36" x2="364" y1={BASELINE_Y} y2={BASELINE_Y} className="stroke-rule" />

			<g transform="translate(250 14)">
				<rect width="114" height="28" rx="14" className="fill-surface/90 stroke-rule" />
				<foreignObject x="10" y="6" width="16" height="16">
					<FileText size={16} className="text-accent" />
				</foreignObject>
				<text x="32" y="18" className="fill-ink-mute font-mono text-[9px]">
					results.pdf
				</text>
			</g>

			{BAR_HEIGHTS.map((height, index) => {
				const x = FIRST_BAR_X + index * (BAR_WIDTH + BAR_GAP);
				return (
					<g key={x}>
						<motion.rect
							x={x}
							y={BASELINE_Y - height}
							width={BAR_WIDTH}
							height={height}
							rx="4"
							className="fill-accent/25 stroke-accent"
							style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
							initial={{ scaleY: animated ? 0 : 1 }}
							animate={{ scaleY: loops || !animated ? 1 : 0 }}
							transition={{ type: "spring", stiffness: 90, damping: 16, delay: index * 0.09 }}
						/>
						<text
							x={x + BAR_WIDTH / 2}
							y={BASELINE_Y + 16}
							textAnchor="middle"
							className="fill-ink-mute font-mono text-[9px]"
						>
							Z{index + 1}
						</text>
					</g>
				);
			})}

			{animated && (
				<motion.line
					x1={FIRST_BAR_X - 6}
					x2={FIRST_BAR_X - 6}
					y1="52"
					y2={BASELINE_Y}
					className="stroke-accent"
					strokeWidth="1.5"
					style={{ filter: "drop-shadow(0 0 4px rgb(232 80 58 / 90%))" }}
					animate={loops ? { x: [0, SCAN_RANGE_PX], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
					transition={
						loops
							? { duration: 3.6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.8 }
							: { duration: 0 }
					}
				/>
			)}
		</svg>
	);
}
