<script lang="ts">
	import { resolve } from '$app/paths';
	import { X } from '@lucide/svelte';
	import { siteRoutes, type SiteRoute } from '$lib/data/routes';
	import Glossary from '$lib/components/sections/Glossary.svelte';
	import { language, setLanguage, type Language } from '$lib/i18n';

	let { routeId }: { routeId: string | null } = $props();

	// Reactive viewport/layout measurements (see <svelte:window> and the nav's
	// bind:clientHeight below) — no manual listeners or hardcoded heights.
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let navHeight = $state(0);
	let lexiconOpen = $state(false);
	let lexiconButton = $state<HTMLButtonElement | null>(null);
	let lexiconPanel = $state<HTMLDivElement | null>(null);
	let navList = $state<HTMLUListElement | null>(null);

	// The introduction page opens with a full-screen hero image. There the nav
	// floats transparently over the photo for a more immersive feel and only
	// gains its solid background once the hero (one viewport tall) scrolls past.
	const isIntro = $derived(routeId === '/');
	const scrolledPastHero = $derived(scrollY > innerHeight - navHeight);
	const transparent = $derived(isIntro && !scrolledPastHero);

	const isActive = (route: SiteRoute) => routeId === route;
	const languageLabel = (value: Language) => (value === 'fr' ? 'Français' : 'English');

	function closeLexicon() {
		lexiconOpen = false;
	}

	function handleWindowClick(event: MouseEvent) {
		if (!lexiconOpen) return;
		const target = event.target as Node;
		if (lexiconButton?.contains(target) || lexiconPanel?.contains(target)) {
			return;
		}
		closeLexicon();
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeLexicon();
		}
	}

	$effect(() => {
		routeId;
		if (!navList || !window.matchMedia('(max-width: 639.98px)').matches) return;
		requestAnimationFrame(() => {
			const current = navList?.querySelector<HTMLElement>('[aria-current="page"]');
			if (!current || !navList) return;
			navList.scrollLeft = Math.max(
				0,
				current.offsetLeft - (navList.clientWidth - current.offsetWidth) / 2
			);
		});
	});
</script>

<svelte:window bind:scrollY bind:innerHeight onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<nav
	bind:clientHeight={navHeight}
	class={[
		'top-0 z-50 border-b transition-colors duration-300',
		isIntro ? 'fixed inset-x-0' : 'sticky',
		transparent
			? 'border-transparent bg-transparent text-white'
			: 'border-gray-200 bg-white text-gray-900'
	]}
	aria-label={$language === 'fr' ? 'Sommaire' : 'Table of contents'}
>
	<div class="relative flex w-full items-center gap-1 px-2 sm:block sm:px-6">
		<div
			class={[
				'grid h-8 w-20 shrink-0 grid-cols-2 items-stretch rounded-full border p-0.5 text-[0.7rem] font-semibold tracking-[0.06em] sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2',
				transparent ? 'border-white/70 bg-black/10 text-white' : 'border-[#6d1d3b] bg-white text-[#6d1d3b]'
			]}
			aria-label={$language === 'fr' ? 'Choisir la langue' : 'Choose language'}
		>
			{#each ['fr', 'en'] as value (value)}
				<button
					type="button"
					class={[
						'inline-flex h-full min-h-0 min-w-0 items-center justify-center rounded-full border border-transparent p-0 leading-none transition-colors',
						$language === value
							? transparent
								? 'bg-white text-gray-950'
								: 'bg-[#6d1d3b] text-white'
							: transparent
								? 'text-white/80 hover:text-white'
								: 'hover:bg-[#6d1d3b]/10'
					]}
					aria-label={languageLabel(value as Language)}
					aria-pressed={$language === value}
					onclick={() => setLanguage(value as Language)}
				>
					{value.toUpperCase()}
				</button>
			{/each}
		</div>
		<ul
			bind:this={navList}
			class="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap pr-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-auto sm:max-w-5xl sm:justify-center sm:gap-8 sm:overflow-visible sm:whitespace-normal sm:px-24 [&::-webkit-scrollbar]:hidden"
		>
			{#each siteRoutes as section (section.href)}
				<li class="shrink-0">
					<a
						href={resolve(section.href as '/')}
						aria-current={isActive(section.href) ? 'page' : undefined}
						class={[
							'my-3 block rounded-full border px-3 py-1.5 text-sm transition-colors sm:my-4 sm:px-4',
							isActive(section.href)
								? ['font-medium', transparent ? 'border-white text-white' : 'border-gray-900 text-gray-900']
								: 'border-transparent hover:underline'
						]}
					>
						{section.label[$language]}
					</a>
				</li>
			{/each}
		</ul>

		<button
			bind:this={lexiconButton}
			type="button"
			class={[
				'relative shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:px-4',
				transparent
					? 'border-white/70 bg-black/10 text-white hover:border-white'
					: 'border-[#6d1d3b] bg-[#6d1d3b] text-white hover:bg-[#54162e]',
				lexiconOpen && !transparent ? 'border-gray-900 text-gray-900' : ''
			]}
			aria-expanded={lexiconOpen}
			aria-controls="dashboard-lexicon-panel"
			onclick={() => (lexiconOpen = !lexiconOpen)}
		>
			{$language === 'fr' ? 'Lexique' : 'Lexicon'}
		</button>

		{#if lexiconOpen}
			<div
				bind:this={lexiconPanel}
				id="dashboard-lexicon-panel"
				class="absolute right-2 top-full z-50 mt-2 max-h-[calc(100vh-5rem)] w-[min(calc(100vw-1rem),44rem)] overflow-y-auto border border-gray-300 bg-white p-5 text-left text-sm shadow-sm sm:right-6 sm:w-[min(calc(100vw-2rem),44rem)]"
			>
				<button
					type="button"
					class="absolute right-3 top-3 border border-transparent p-1 text-gray-500 hover:border-gray-300 hover:text-gray-900"
					aria-label={$language === 'fr' ? 'Fermer le lexique' : 'Close lexicon'}
					onclick={closeLexicon}
				>
					<X size={16} strokeWidth={1.75} />
				</button>
				<div class="pr-7">
					<Glossary />
				</div>
			</div>
		{/if}
	</div>
</nav>
