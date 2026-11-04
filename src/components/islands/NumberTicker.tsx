import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface NumberTickerProps {
	value: number;
	suffix?: string;
	durationSeconds?: number;
}

const DEFAULT_DURATION_SECONDS = 1.6;

/**
 * Counts from 0 to `value` once it scrolls into view. Server-renders the final value so it is
 * correct without JavaScript. Hydrate with `client:visible`.
 */
export default function NumberTicker({
	value,
	suffix = "",
	durationSeconds = DEFAULT_DURATION_SECONDS,
}: NumberTickerProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, margin: "-10% 0px" });
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		const element = ref.current;
		if (!inView || reduceMotion || !element) return;

		const controls = animate(0, value, {
			duration: durationSeconds,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (current) => {
				element.textContent = `${Math.round(current)}${suffix}`;
			},
		});
		return () => controls.stop();
	}, [inView, reduceMotion, value, suffix, durationSeconds]);

	return (
		<span ref={ref} className="tabular-nums">
			{value}
			{suffix}
		</span>
	);
}
