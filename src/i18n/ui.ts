export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
	en: "English",
	es: "Español",
};

export const OG_LOCALES: Record<Locale, string> = {
	en: "en_US",
	es: "es_ES",
};

export interface UiStrings {
	skipToContent: string;
	backToTop: string;
	nav: {
		label: string;
		about: string;
		projects: string;
		career: string;
		contact: string;
		openMenu: string;
		closeMenu: string;
		switchLanguage: string;
	};
	mode: {
		toDev: string;
		toPreview: string;
		dev: string;
		preview: string;
	};
	hero: {
		getInTouch: string;
		viewWork: string;
		hoverToDisturb: string;
		scroll: string;
		roles: string[];
	};
	about: {
		stack: string;
		localTime: string;
		yearsLabel: string;
		companiesLabel: string;
		projectsLabel: string;
		homeLabTitle: string;
		homeLabText: string;
	};
	projects: {
		heading: string;
		filterLabel: string;
		filterAll: string;
		repo: string;
		demo: string;
		featured: string;
	};
	career: {
		heading: string;
		present: string;
		now: string;
	};
	contact: {
		heading: string;
		intro: string;
		title: string;
		copyEmail: string;
		copied: string;
		sendEmail: string;
		socials: string;
	};
	footer: {
		rights: string;
	};
}

export const ui: Record<Locale, UiStrings> = {
	en: {
		skipToContent: "Skip to content",
		backToTop: "Back to top",
		nav: {
			label: "Section",
			about: "About",
			projects: "Projects",
			career: "Career",
			contact: "Contact",
			openMenu: "Open menu",
			closeMenu: "Close menu",
			switchLanguage: "Switch language",
		},
		mode: {
			toDev: "Switch to dev mode",
			toPreview: "Switch to preview mode",
			dev: "dev",
			preview: "preview",
		},
		hero: {
			getInTouch: "Get in touch",
			viewWork: "View my work",
			hoverToDisturb: "hover to disturb",
			scroll: "Scroll",
			roles: ["Full Stack Developer", "Computer Science Engineer", "Home lab & IoT builder"],
		},
		about: {
			stack: "Stack",
			localTime: "Local time",
			yearsLabel: "years of experience",
			companiesLabel: "companies",
			projectsLabel: "projects",
			homeLabTitle: "Home lab",
			homeLabText: "Proxmox, TrueNAS and Docker running my own services and IoT.",
		},
		projects: {
			heading: "Projects",
			filterLabel: "Filter projects by technology",
			filterAll: "All",
			repo: "Repo",
			demo: "Demo",
			featured: "Featured",
		},
		career: {
			heading: "Career",
			present: "Present",
			now: "Now",
		},
		contact: {
			heading: "Contact",
			intro: "Have a project in mind, or an opportunity where you think I'd be a good fit? I'd love to hear about it.",
			title: "Let's build something",
			copyEmail: "Copy email",
			copied: "Copied!",
			sendEmail: "Send an email",
			socials: "Find me on",
		},
		footer: {
			rights: "All rights reserved.",
		},
	},
	es: {
		skipToContent: "Saltar al contenido",
		backToTop: "Volver arriba",
		nav: {
			label: "Sección",
			about: "Sobre mí",
			projects: "Proyectos",
			career: "Trayectoria",
			contact: "Contacto",
			openMenu: "Abrir menú",
			closeMenu: "Cerrar menú",
			switchLanguage: "Cambiar idioma",
		},
		mode: {
			toDev: "Cambiar al modo dev",
			toPreview: "Cambiar al modo preview",
			dev: "dev",
			preview: "preview",
		},
		hero: {
			getInTouch: "Contáctame",
			viewWork: "Ver mi trabajo",
			hoverToDisturb: "pasa el cursor para perturbar",
			scroll: "Desplázate",
			roles: ["Desarrollador Full Stack", "Ingeniero Informático", "Home lab e IoT"],
		},
		about: {
			stack: "Stack",
			localTime: "Hora local",
			yearsLabel: "años de experiencia",
			companiesLabel: "empresas",
			projectsLabel: "proyectos",
			homeLabTitle: "Home lab",
			homeLabText: "Proxmox, TrueNAS y Docker alojando mis propios servicios e IoT.",
		},
		projects: {
			heading: "Proyectos",
			filterLabel: "Filtrar proyectos por tecnología",
			filterAll: "Todos",
			repo: "Repo",
			demo: "Demo",
			featured: "Destacado",
		},
		career: {
			heading: "Trayectoria",
			present: "Actualidad",
			now: "Ahora",
		},
		contact: {
			heading: "Contacto",
			intro:
				"¿Tienes un proyecto en mente o una oportunidad en la que crees que podría encajar? Me encantaría saber de ti.",
			title: "Construyamos algo",
			copyEmail: "Copiar email",
			copied: "¡Copiado!",
			sendEmail: "Enviar un email",
			socials: "Encuéntrame en",
		},
		footer: {
			rights: "Todos los derechos reservados.",
		},
	},
};
