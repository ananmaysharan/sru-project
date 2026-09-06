<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteRoutes, type SiteRoute } from '$lib/data/routes';
	import { language } from '$lib/i18n';

	let { routeId }: { routeId: string | null } = $props();

	const isActive = (route: SiteRoute) => routeId === route;

	const currentIndex = $derived.by(() => {
		const index = siteRoutes.findIndex((route) => isActive(route.href));
		return index === -1 ? 0 : index;
	});

	const previousRoute = $derived(currentIndex > 0 ? siteRoutes[currentIndex - 1] : null);
	const nextRoute = $derived(
		currentIndex < siteRoutes.length - 1 ? siteRoutes[currentIndex + 1] : null
	);
</script>

<nav
	class="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 px-4 py-10 sm:grid-cols-2 sm:px-6"
	aria-label={$language === 'fr' ? 'Navigation entre les pages' : 'Page navigation'}
>
	{#if previousRoute}
		<a
			href={resolve(previousRoute.href as '/')}
			class="border border-gray-300 px-3 py-3 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900"
		>
			<span class="block text-xs text-gray-500">
				{$language === 'fr' ? 'Page précédente' : 'Previous page'}
			</span>
			{previousRoute.label[$language]}
		</a>
	{/if}

	{#if nextRoute}
		<a
			href={resolve(nextRoute.href as '/')}
			class="border border-gray-300 px-3 py-3 text-right text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 sm:ml-auto"
		>
			<span class="block text-xs text-gray-500">
				{$language === 'fr' ? 'Page suivante' : 'Next page'}
			</span>
			{nextRoute.label[$language]}
		</a>
	{/if}
</nav>
