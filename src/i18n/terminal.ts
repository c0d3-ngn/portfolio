import type { Locale } from "./ui";

export interface TerminalStrings {
	pageTitle: string;
	windowTitle: string;
	skipToPreview: string;
	noscript: string;
	inputLabel: string;
	outputLabel: string;
	quickCommandsLabel: string;
	skipHint: string;
	boot: string[];
	errors: {
		notFound: string;
		didYouMean: string;
		tryHelp: string;
		usage: string;
		failed: string;
	};
	descriptions: {
		help: string;
		neofetch: string;
		about: string;
		projects: string;
		career: string;
		contact: string;
		clear: string;
		mode: string;
		lang: string;
		history: string;
		echo: string;
		date: string;
	};
	usages: {
		projects: string;
		career: string;
		mode: string;
		lang: string;
		echo: string;
	};
	help: {
		title: string;
		aliases: string;
		footer: string;
	};
	neofetch: {
		role: string;
		location: string;
		experience: string;
		company: string;
		stack: string;
		email: string;
		languages: string;
		years: string;
		languagesValue: string;
	};
	projects: {
		header: string;
		filtered: string;
		none: string;
		noMatch: string;
		featured: string;
		repo: string;
		demo: string;
		stack: string;
		tags: string;
		detailsHint: string;
	};
	career: {
		header: string;
		now: string;
		none: string;
	};
	contact: {
		header: string;
		email: string;
	};
	mode: {
		switching: string;
		unknown: string;
	};
	lang: {
		switching: string;
		already: string;
		unknown: string;
	};
	history: {
		empty: string;
	};
	eggs: {
		sudo: string;
		matrix: string;
		matrixReduced: string;
		coffee: string[];
		jokes: string[];
		rm: string;
		vim: string;
		pwd: string;
		lsHint: string;
	};
}

export const terminalStrings: Record<Locale, TerminalStrings> = {
	en: {
		pageTitle: "ivan@portfolio — dev mode",
		windowTitle: "ivan@portfolio: ~",
		skipToPreview: "Prefer the regular site?",
		noscript: "The interactive terminal needs JavaScript. You can still browse the regular site.",
		inputLabel: "Terminal command",
		outputLabel: "Terminal output",
		quickCommandsLabel: "Quick commands",
		skipHint: "press any key to skip",
		boot: ["booting portfolio-sh v1.0 …", "mounting /home/ivan … ok", "loading profile … ok"],
		errors: {
			notFound: "command not found: {name}",
			didYouMean: "Did you mean '{name}'?",
			tryHelp: "Type 'help' to list the available commands.",
			usage: "usage: {usage}",
			failed: "Something went wrong running that command.",
		},
		descriptions: {
			help: "List the available commands",
			neofetch: "Show a profile summary",
			about: "Read the short bio",
			projects: "List projects, or show one in detail",
			career: "Show work experience",
			contact: "Show ways to get in touch",
			clear: "Clear the screen",
			mode: "Switch mode (mode preview)",
			lang: "Switch language (lang en|es)",
			history: "Show the commands you have run",
			echo: "Print the given text",
			date: "Show the current date and time",
		},
		usages: {
			projects: "projects [number|name] [--featured] [--tag <tag>] [--stack <tech>]",
			career: "career [--current]",
			mode: "mode preview",
			lang: "lang <en|es>",
			echo: "echo <text>",
		},
		help: {
			title: "Available commands",
			aliases: "aliases",
			footer: "Tab completes, ↑/↓ browse history. Some commands are not listed here — try poking around.",
		},
		neofetch: {
			role: "Role",
			location: "Location",
			experience: "Experience",
			company: "Currently",
			stack: "Stack",
			email: "Email",
			languages: "Languages",
			years: "{n}+ years",
			languagesValue: "English, Español",
		},
		projects: {
			header: "{n} projects",
			filtered: "{n} of {total} projects",
			none: "There are no projects to show.",
			noMatch: "No project matches '{query}'.",
			featured: "featured",
			repo: "repo",
			demo: "demo",
			stack: "stack",
			tags: "tags",
			detailsHint: "Run 'projects <number>' for details.",
		},
		career: {
			header: "Career",
			now: "now",
			none: "There is no experience to show.",
		},
		contact: {
			header: "Get in touch",
			email: "email",
		},
		mode: {
			switching: "Switching to preview mode …",
			unknown: "Unknown mode '{mode}'. Available: preview",
		},
		lang: {
			switching: "Switching language to {language} …",
			already: "Already using {language}.",
			unknown: "Unknown language '{lang}'. Available: en, es",
		},
		history: {
			empty: "No commands yet.",
		},
		eggs: {
			sudo: "ivan is not in the sudoers file. This incident will be reported.",
			matrix: "Wake up, Neo …",
			matrixReduced: "(digital rain is off: reduced motion is enabled)",
			coffee: ["Brewing …", "Done. Productivity +10%, bugs unchanged."],
			jokes: [
				"There are 10 types of people: those who understand binary and those who don't.",
				"A SQL query walks into a bar, approaches two tables and asks: 'Can I join you?'",
				"It works on my machine. — Then we'll ship your machine.",
			],
			rm: "rm: it is dangerous to operate recursively on '/'. Nice try.",
			vim: "You are now in vim. There is no escape. (Just kidding — type 'exit'.)",
			pwd: "/home/ivan/portfolio",
			lsHint: "No file system here, just sections. Try running them as commands.",
		},
	},
	es: {
		pageTitle: "ivan@portfolio — modo dev",
		windowTitle: "ivan@portfolio: ~",
		skipToPreview: "¿Prefieres la web normal?",
		noscript: "El terminal interactivo necesita JavaScript. Aún puedes navegar por la web normal.",
		inputLabel: "Comando de terminal",
		outputLabel: "Salida del terminal",
		quickCommandsLabel: "Comandos rápidos",
		skipHint: "pulsa cualquier tecla para saltar",
		boot: ["arrancando portfolio-sh v1.0 …", "montando /home/ivan … ok", "cargando perfil … ok"],
		errors: {
			notFound: "comando no encontrado: {name}",
			didYouMean: "¿Quisiste decir '{name}'?",
			tryHelp: "Escribe 'help' para ver los comandos disponibles.",
			usage: "uso: {usage}",
			failed: "Algo salió mal al ejecutar ese comando.",
		},
		descriptions: {
			help: "Lista los comandos disponibles",
			neofetch: "Muestra un resumen del perfil",
			about: "Lee la biografía breve",
			projects: "Lista los proyectos o muestra uno al detalle",
			career: "Muestra la experiencia profesional",
			contact: "Muestra cómo contactar",
			clear: "Limpia la pantalla",
			mode: "Cambia de modo (mode preview)",
			lang: "Cambia de idioma (lang en|es)",
			history: "Muestra los comandos ejecutados",
			echo: "Imprime el texto indicado",
			date: "Muestra la fecha y hora actuales",
		},
		usages: {
			projects: "projects [número|nombre] [--featured] [--tag <etiqueta>] [--stack <tecnología>]",
			career: "career [--current]",
			mode: "mode preview",
			lang: "lang <en|es>",
			echo: "echo <texto>",
		},
		help: {
			title: "Comandos disponibles",
			aliases: "alias",
			footer: "Tab autocompleta, ↑/↓ recorren el historial. Hay comandos que no aparecen aquí — explora un poco.",
		},
		neofetch: {
			role: "Rol",
			location: "Ubicación",
			experience: "Experiencia",
			company: "Actualmente",
			stack: "Stack",
			email: "Email",
			languages: "Idiomas",
			years: "{n}+ años",
			languagesValue: "English, Español",
		},
		projects: {
			header: "{n} proyectos",
			filtered: "{n} de {total} proyectos",
			none: "No hay proyectos que mostrar.",
			noMatch: "Ningún proyecto coincide con '{query}'.",
			featured: "destacado",
			repo: "repo",
			demo: "demo",
			stack: "stack",
			tags: "etiquetas",
			detailsHint: "Ejecuta 'projects <número>' para ver el detalle.",
		},
		career: {
			header: "Trayectoria",
			now: "ahora",
			none: "No hay experiencia que mostrar.",
		},
		contact: {
			header: "Contacto",
			email: "email",
		},
		mode: {
			switching: "Cambiando al modo preview …",
			unknown: "Modo desconocido '{mode}'. Disponible: preview",
		},
		lang: {
			switching: "Cambiando el idioma a {language} …",
			already: "Ya estás usando {language}.",
			unknown: "Idioma desconocido '{lang}'. Disponibles: en, es",
		},
		history: {
			empty: "Todavía no hay comandos.",
		},
		eggs: {
			sudo: "ivan no está en el archivo sudoers. Este incidente será reportado.",
			matrix: "Despierta, Neo …",
			matrixReduced: "(la lluvia digital está desactivada: reduced motion activo)",
			coffee: ["Preparando …", "Listo. Productividad +10%, bugs sin cambios."],
			jokes: [
				"Hay 10 tipos de personas: las que entienden binario y las que no.",
				"Una consulta SQL entra en un bar, se acerca a dos tablas y pregunta: «¿Puedo unirme?»",
				"Funciona en mi máquina. — Pues enviemos tu máquina.",
			],
			rm: "rm: es peligroso operar recursivamente sobre '/'. Buen intento.",
			vim: "Estás en vim. No hay escapatoria. (Es broma — escribe 'exit'.)",
			pwd: "/home/ivan/portfolio",
			lsHint: "Aquí no hay sistema de archivos, solo secciones. Prueba a ejecutarlas como comandos.",
		},
	},
};

/** Replaces `{key}` placeholders; unknown keys are left in place. */
export function fill(template: string, values: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
