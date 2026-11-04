import { useEffect, useRef } from "react";

interface MatrixRainProps {
	onDone: () => void;
	durationMs?: number;
}

const GLYPHS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>/{}=+*";
const FONT_SIZE_PX = 15;
const FRAME_INTERVAL_MS = 55;
const DEFAULT_DURATION_MS = 4500;
const RAIN_COLOR = "#7ee0a0";
const FADE_COLOR = "rgb(10 10 11 / 14%)";

/**
 * Falling-glyph overlay for the `matrix` easter egg. Fills its positioned parent and ends after a
 * few seconds, or on any key press or click. Loaded lazily and only mounted on request.
 */
export default function MatrixRain({ onDone, durationMs = DEFAULT_DURATION_MS }: MatrixRainProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		const parent = canvas?.parentElement;
		if (!canvas || !context || !parent) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const width = parent.clientWidth;
		const height = parent.clientHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		context.scale(dpr, dpr);
		context.font = `${FONT_SIZE_PX}px monospace`;

		const columns = Math.ceil(width / FONT_SIZE_PX);
		const drops = Array.from({ length: columns }, () => Math.random() * -20);
		let frameId = 0;
		let lastFrame = 0;

		const draw = (timestamp: number) => {
			frameId = requestAnimationFrame(draw);
			if (timestamp - lastFrame < FRAME_INTERVAL_MS) return;
			lastFrame = timestamp;

			context.fillStyle = FADE_COLOR;
			context.fillRect(0, 0, width, height);
			context.fillStyle = RAIN_COLOR;
			drops.forEach((drop, column) => {
				const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
				context.fillText(glyph, column * FONT_SIZE_PX, drop * FONT_SIZE_PX);
				drops[column] = drop * FONT_SIZE_PX > height && Math.random() > 0.975 ? 0 : drop + 1;
			});
		};
		frameId = requestAnimationFrame(draw);

		const stop = () => onDone();
		const timer = window.setTimeout(stop, durationMs);
		window.addEventListener("keydown", stop);
		window.addEventListener("pointerdown", stop);

		return () => {
			cancelAnimationFrame(frameId);
			window.clearTimeout(timer);
			window.removeEventListener("keydown", stop);
			window.removeEventListener("pointerdown", stop);
		};
	}, [onDone, durationMs]);

	return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-10 h-full w-full bg-ground/80" />;
}
