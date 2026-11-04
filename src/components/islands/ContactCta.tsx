import { Check, Copy, Mail } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";

interface ContactCtaProps {
	title: string;
	email: string;
	labels: {
		copy: string;
		copied: string;
		send: string;
	};
}

const COPIED_RESET_MS = 2000;
const LETTER_STAGGER_SECONDS = 0.025;

const wordVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: LETTER_STAGGER_SECONDS } },
} as const;

const letterVariants = {
	hidden: { opacity: 0, y: "0.6em", rotateX: -60 },
	visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
} as const;

/**
 * Letter-by-letter headline plus a copy-to-clipboard email button that falls back to a mailto
 * link. Hydrate with `client:visible`.
 */
export default function ContactCta({ title, email, labels }: ContactCtaProps) {
	const [copied, setCopied] = useState(false);
	const resetTimer = useRef<number>(0);
	const words = title.split(" ");

	useEffect(() => () => window.clearTimeout(resetTimer.current), []);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
		} catch {
			window.location.href = `mailto:${email}`;
			return;
		}
		setCopied(true);
		window.clearTimeout(resetTimer.current);
		resetTimer.current = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
	};

	return (
		<MotionConfig reducedMotion="user">
			<motion.h3
				aria-label={title}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "0px 0px -20% 0px" }}
				variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
				className="font-display text-[clamp(2.5rem,2rem+5vw,6.5rem)] leading-[0.95] tracking-tight text-ink [perspective:800px]"
			>
				{words.map((word, wordIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: the word list is static and never reordered
					<Fragment key={`${word}-${wordIndex}`}>
						{wordIndex > 0 && " "}
						<motion.span aria-hidden="true" variants={wordVariants} className="inline-block whitespace-nowrap">
							{[...word].map((letter, letterIndex) => (
								<motion.span
									// biome-ignore lint/suspicious/noArrayIndexKey: the letter list is static and never reordered
									key={`${letter}-${letterIndex}`}
									variants={letterVariants}
									className="inline-block"
								>
									{letter}
								</motion.span>
							))}
						</motion.span>
					</Fragment>
				))}
			</motion.h3>

			<div className="mt-10 flex flex-wrap items-center gap-4">
				<motion.button
					type="button"
					onClick={copyEmail}
					aria-label={`${labels.copy}: ${email}`}
					whileTap={{ scale: 0.96 }}
					className="group inline-flex h-14 max-w-full items-center gap-3 rounded-full bg-accent px-7 font-mono text-sm text-ground transition-shadow duration-300 hover:shadow-[0_0_48px_-4px_rgb(232_80_58/60%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
				>
					<span className="relative grid h-5 w-5 place-items-center">
						<AnimatePresence mode="wait" initial={false}>
							<motion.span
								key={copied ? "copied" : "idle"}
								initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
								animate={{ scale: 1, opacity: 1, rotate: 0 }}
								exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
								transition={{ duration: 0.18 }}
								className="absolute"
							>
								{copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
							</motion.span>
						</AnimatePresence>
					</span>
					<span className="truncate">{email}</span>
				</motion.button>

				<a
					href={`mailto:${email}`}
					className="link-accent inline-flex h-14 items-center gap-2 rounded-full border border-rule px-6 font-mono text-sm text-ink hover:border-accent"
				>
					<Mail aria-hidden="true" size={16} />
					{labels.send}
				</a>

				<span role="status" aria-live="polite" className="font-mono text-sm text-accent">
					{copied ? labels.copied : ""}
				</span>
			</div>
		</MotionConfig>
	);
}
