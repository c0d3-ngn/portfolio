import type { z } from "astro/zod";
import type { careerSchema, projectSchema } from "@/content.config";

export const PROJECT_PREVIEW_MODES = ["pulse", "bars", "grid", "roots"] as const;
export type ProjectPreview = (typeof PROJECT_PREVIEW_MODES)[number];

export type ProjectData = z.infer<typeof projectSchema>;

/** A career entry. An absent `end` marks the current role. */
export type CareerData = z.infer<typeof careerSchema>;
