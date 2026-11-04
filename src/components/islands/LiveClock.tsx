import { useEffect, useState } from "react";

interface LiveClockProps {
	timeZone: string;
	locale: string;
}

const PLACEHOLDER = "--:--";
const TICK_MS = 1000;

function formatTime(timeZone: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(
		new Date(),
	);
}

/**
 * Current time in a fixed time zone. Renders a placeholder on the server so the static HTML never
 * carries a stale time. Hydrate with `client:visible`.
 */
export default function LiveClock({ timeZone, locale }: LiveClockProps) {
	const [time, setTime] = useState(PLACEHOLDER);

	useEffect(() => {
		const update = () => setTime(formatTime(timeZone, locale));
		update();
		const timer = window.setInterval(update, TICK_MS);
		return () => window.clearInterval(timer);
	}, [timeZone, locale]);

	return (
		<time dateTime={time === PLACEHOLDER ? undefined : time} className="tabular-nums" suppressHydrationWarning>
			{time}
		</time>
	);
}
