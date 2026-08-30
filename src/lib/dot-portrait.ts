import { hasPrecisePointer, prefersReducedMotion } from "./motion";
import { repelDisplacement } from "./repel";
import { runWhileVisible } from "./visibility-loop";

interface Dot {
	restX: number;
	restY: number;
	x: number;
	y: number;
	color: string;
	radius: number;
}

const GRID_SIZE = 34;
const ALPHA_CUTOFF = 40;
const REPEL_RADIUS_MULTIPLIER = 4.2;
const REPEL_STRENGTH_MULTIPLIER = 2.4;
const EASE_FACTOR = 0.18;

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

function sampleGrid(img: HTMLImageElement, cols: number, rows: number) {
	const offscreen = document.createElement("canvas");
	offscreen.width = cols;
	offscreen.height = rows;
	const octx = offscreen.getContext("2d");
	if (!octx) return [];
	octx.imageSmoothingEnabled = false;
	octx.drawImage(img, 0, 0, cols, rows);
	const data = octx.getImageData(0, 0, cols, rows).data;
	const cells: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			const i = (y * cols + x) * 4;
			const a = data[i + 3]!;
			if (a < ALPHA_CUTOFF) continue;
			cells.push({ x, y, r: data[i]!, g: data[i + 1]!, b: data[i + 2]!, a });
		}
	}
	return cells;
}

function layoutDots(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const size = canvas.getBoundingClientRect().width;
	canvas.width = size * dpr;
	canvas.height = size * dpr;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const cellSize = size / GRID_SIZE;
	const cells = sampleGrid(img, GRID_SIZE, GRID_SIZE);
	const dots: Dot[] = cells.map((cell) => {
		const restX = (cell.x + 0.5) * cellSize;
		const restY = (cell.y + 0.5) * cellSize;
		return {
			restX,
			restY,
			x: restX,
			y: restY,
			color: `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a / 255})`,
			radius: cellSize * 0.34,
		};
	});

	return { size, cellSize, dots };
}

async function mountAvatar(canvas: HTMLCanvasElement): Promise<() => void> {
	const src = canvas.dataset.src;
	const ctx = canvas.getContext("2d");
	if (!src || !ctx) return () => {};

	const img = await loadImage(src);
	let { size, cellSize, dots } = layoutDots(img, canvas, ctx);

	function draw() {
		ctx!.clearRect(0, 0, size, size);
		for (const d of dots) {
			ctx!.fillStyle = d.color;
			ctx!.beginPath();
			ctx!.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
			ctx!.fill();
		}
	}

	draw();

	let resizeFrame: number | null = null;
	const handleResize = () => {
		if (resizeFrame !== null) return;
		resizeFrame = requestAnimationFrame(() => {
			resizeFrame = null;
			({ size, cellSize, dots } = layoutDots(img, canvas, ctx));
			draw();
		});
	};
	window.addEventListener("resize", handleResize);

	if (prefersReducedMotion() || !hasPrecisePointer()) {
		return () => window.removeEventListener("resize", handleResize);
	}

	let mouseX = -9999;
	let mouseY = -9999;
	const onMouseMove = (event: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	};
	const onMouseLeave = () => {
		mouseX = -9999;
		mouseY = -9999;
	};
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mouseleave", onMouseLeave);

	const stopVisibilityLoop = runWhileVisible([canvas], () => {
		const repelRadius = cellSize * REPEL_RADIUS_MULTIPLIER;
		const repelStrength = cellSize * REPEL_STRENGTH_MULTIPLIER;
		for (const d of dots) {
			const displacement = repelDisplacement(d.restX - mouseX, d.restY - mouseY, repelRadius, repelStrength);
			const targetX = d.restX + displacement.x;
			const targetY = d.restY + displacement.y;
			d.x += (targetX - d.x) * EASE_FACTOR;
			d.y += (targetY - d.y) * EASE_FACTOR;
		}
		draw();
	});

	return () => {
		window.removeEventListener("resize", handleResize);
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("mouseleave", onMouseLeave);
		stopVisibilityLoop();
	};
}

let cleanup: (() => void) | null = null;

function initDotPortraits(): void {
	cleanup?.();
	cleanup = null;

	const stops: (() => void)[] = [];
	for (const canvas of document.querySelectorAll<HTMLCanvasElement>("canvas[data-src]")) {
		mountAvatar(canvas)
			.then((stop) => stops.push(stop))
			.catch((error: unknown) => console.error("Failed to mount avatar canvas:", error));
	}

	cleanup = () => {
		for (const stop of stops) stop();
	};
}

document.addEventListener("astro:page-load", initDotPortraits);
