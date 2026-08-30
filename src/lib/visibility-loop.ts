/**
 * Runs `tick` on every animation frame while at least one of `targets` is
 * intersecting the viewport, pausing otherwise. `tick` receives both the
 * elapsed time since the current visible session started (0 again each time
 * every target has left and one re-enters) and the raw `requestAnimationFrame`
 * timestamp, so callers can use whichever fits. Returns a function that stops
 * the loop and disconnects the observer.
 */
export function runWhileVisible(targets: Element[], tick: (elapsed: number, timestamp: number) => void): () => void {
	const visible = new Set<Element>();
	let frameId: number | null = null;
	let sessionStart: number | null = null;

	function frame(timestamp: number) {
		for (const target of targets) {
			if (!target.isConnected) visible.delete(target);
		}
		if (visible.size === 0) {
			frameId = null;
			sessionStart = null;
			return;
		}
		if (sessionStart === null) sessionStart = timestamp;
		tick(timestamp - sessionStart, timestamp);
		frameId = requestAnimationFrame(frame);
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) visible.add(entry.target);
				else visible.delete(entry.target);
			}
			if (visible.size === 0) {
				sessionStart = null;
			} else if (frameId === null) {
				frameId = requestAnimationFrame(frame);
			}
		},
		{ threshold: 0.1 },
	);
	for (const target of targets) observer.observe(target);

	return () => {
		observer.disconnect();
		if (frameId !== null) cancelAnimationFrame(frameId);
		frameId = null;
	};
}
