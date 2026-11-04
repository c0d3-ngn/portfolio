import { motion } from "motion/react";
import { useVisualState } from "./use-visual-state";

const units = ["pve-01", "truenas", "docker", "iot-hub"] as const;
const LEDS_PER_UNIT = 3;
const UNIT_HEIGHT = 36;
const UNIT_PITCH = 46;

/**
 * Server-rack illustration: stacked units whose status LEDs blink out of phase.
 */
export default function RackVisual() {
	const { ref, loops } = useVisualState<SVGSVGElement>();

	return (
		<svg ref={ref} viewBox="0 0 400 220" aria-hidden="true" className="absolute inset-0 z-1 h-full w-full">
			<rect x="58" y="16" width="284" height="188" rx="14" className="fill-ground/70 stroke-rule" />

			{units.map((name, unit) => (
				<g key={name} transform={`translate(72 ${28 + unit * UNIT_PITCH})`}>
					<rect width="256" height={UNIT_HEIGHT} rx="8" className="fill-surface stroke-rule" />

					{Array.from({ length: LEDS_PER_UNIT }, (_, led) => {
						const isActivity = led === 0;
						return (
							<motion.circle
								// biome-ignore lint/suspicious/noArrayIndexKey: the LED row is static and never reordered
								key={led}
								cx={18 + led * 13}
								cy={UNIT_HEIGHT / 2}
								r="3"
								className={isActivity ? "fill-accent" : "fill-ink-mute/50"}
								style={isActivity ? { filter: "drop-shadow(0 0 4px rgb(232 80 58 / 90%))" } : undefined}
								initial={false}
								animate={loops && isActivity ? { opacity: [1, 0.15, 1, 0.5, 1] } : { opacity: 1 }}
								transition={
									loops && isActivity
										? { duration: 1.4 + unit * 0.45, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
										: { duration: 0 }
								}
							/>
						);
					})}

					<text x="64" y="22" className="fill-ink-mute font-mono text-[10px]">
						{name}
					</text>

					{Array.from({ length: 9 }, (_, slot) => (
						<line
							// biome-ignore lint/suspicious/noArrayIndexKey: the vent slots are static and never reordered
							key={slot}
							x1={176 + slot * 8}
							x2={176 + slot * 8}
							y1="10"
							y2={UNIT_HEIGHT - 10}
							className="stroke-rule"
						/>
					))}
				</g>
			))}
		</svg>
	);
}
