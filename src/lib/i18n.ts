import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Language = 'fr' | 'en';

const LANGUAGE_KEY = 'sru-language';
const defaultLanguage: Language = 'fr';

export const language = writable<Language>(defaultLanguage);

export function initializeLanguage() {
	if (!browser) return;
	const requested = new URL(window.location.href).searchParams.get('lang');
	const saved = window.localStorage.getItem(LANGUAGE_KEY);
	const next: Language = requested === 'en' || requested === 'fr'
		? requested
		: saved === 'en' || saved === 'fr'
			? saved
			: defaultLanguage;
	language.set(next);
	document.documentElement.lang = next;
}

export function setLanguage(next: Language) {
	language.set(next);
	if (!browser) return;
	window.localStorage.setItem(LANGUAGE_KEY, next);
	document.documentElement.lang = next;
	const url = new URL(window.location.href);
	url.searchParams.set('lang', next);
	window.history.replaceState(window.history.state, '', url);
}

export function pick<T>(current: Language, translations: { fr: T; en: T }): T {
	return translations[current];
}

export function formatNumber(value: number, current: Language, options?: Intl.NumberFormatOptions) {
	return new Intl.NumberFormat(current === 'fr' ? 'fr-FR' : 'en-US', options).format(value);
}

