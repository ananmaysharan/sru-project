<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteRoutes, type SiteRoute } from '$lib/data/routes';

	let { routeId }: { routeId: string | null } = $props();

	// Reactive viewport/layout measurements (see <svelte:window> and the nav's
	// bind:clientHeight below) — no manual listeners or hardcoded heights.
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let navHeight = $state(0);

	// The introduction page opens with a full-screen hero image. There the nav
	// floats transparently over the photo for a more immersive feel and only
	// gains its solid background once the hero (one viewport tall) scrolls past.
	const isIntro = $derived(routeId === '/');
	const scrolledPastHero = $derived(scrollY > innerHeight - navHeight);
	const transparent = $derived(isIntro && !scrolledPastHero);

	const isActive = (route: SiteRoute) => routeId === route;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<nav
	bind:clientHeight={navHeight}
	class={[
		'top-0 z-50 border-b transition-colors duration-300',
		isIntro ? 'fixed inset-x-0' : 'sticky',
		transparent
			? 'border-transparent bg-transparent text-white'
			: 'border-gray-200 bg-white text-gray-900'
	]}
	aria-label="Table of contents"
>
	<ul
		class="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto whitespace-nowrap px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-8 sm:overflow-visible sm:whitespace-normal sm:px-6 [&::-webkit-scrollbar]:hidden"
	>
		{#each siteRoutes as section (section.href)}
			<li class="shrink-0">
				<a
					href={resolve(section.href as '/')}
					aria-current={isActive(section.href) ? 'page' : undefined}
					class={[
						'my-4 block rounded-full border px-3 py-1.5 text-sm transition-colors sm:px-4',
						isActive(section.href)
							? ['font-medium', transparent ? 'border-white text-white' : 'border-gray-900 text-gray-900']
							: 'border-transparent hover:underline'
					]}
				>
					{section.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
