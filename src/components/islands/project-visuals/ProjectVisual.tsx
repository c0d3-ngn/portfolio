import type { ProjectPreview } from "@/types/content";
import IrrigationVisual from "./IrrigationVisual";
import PulseVisual from "./PulseVisual";
import RackVisual from "./RackVisual";
import TallyVisual from "./TallyVisual";

interface ProjectVisualProps {
	mode: ProjectPreview;
	label?: string;
}

const visuals: Record<ProjectPreview, () => React.JSX.Element> = {
	pulse: PulseVisual,
	bars: TallyVisual,
	grid: RackVisual,
	roots: IrrigationVisual,
};

/**
 * Cover illustration for a project card: a dotted, glowing stage hosting the themed SVG scene.
 * Fills its positioned parent. Add a motif by adding a scene component and a `visuals` entry
 * (and extending `PROJECT_PREVIEW_MODES`).
 */
export default function ProjectVisual({ mode, label }: ProjectVisualProps) {
	const Visual = visuals[mode];

	return (
		<div className="project-preview">
			<div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-50" />
			<Visual />
			{label && <span className="project-preview-label">{label}</span>}
		</div>
	);
}
