/**
 * Reduces the small subset of Markdown used by the content collections (paragraphs, emphasis,
 * links, inline code, headings, list bullets) to plain text, keeping paragraph breaks.
 */
export function markdownToPlainText(markdown: string): string {
	return markdown
		.replace(/\r\n/g, "\n")
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "")
		.replace(/^[ \t]*[-*+][ \t]+/gm, "• ")
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/(^|[\s(])_(.+?)_(?=[\s).,;:!?]|$)/g, "$1$2")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}
