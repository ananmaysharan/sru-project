<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteRoutes, type SiteRoute } from '$lib/data/routes';

	let { currentPath }: { currentPath: string } = $props();

	function isActive(href: SiteRoute): boolean {
		const resolved = resolve(href);
		return currentPath === resolved || currentPath === resolved + '/';
	}

	const currentIndex = $derived.by(() => {
		const index = siteRoutes.findIndex((route) => isActive(route.href));
		return index === -1 ? 0 : index;
	});

	const previousRoute = $derived(
		siteRoutes[(currentIndex - 1 + siteRoutes.length) % siteRoutes.length]
	);
	const nextRoute = $derived(siteRoutes[(currentIndex + 1) % siteRoutes.length]);
</script>

<nav class="mx-auto flex max-w-3xl items-center justify-between py-12" aria-label="Page navigation">
	<a
		href={resolve(previousRoute.href)}
		class="border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900"
	>
		<span class="block text-xs text-gray-500">Previous</span>
		{previousRoute.label}
	</a>

	<a
		href={resolve(nextRoute.href)}
		class="border border-gray-300 px-3 py-2 text-right text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900"
	>
		<span class="block text-xs text-gray-500">Next</span>
		{nextRoute.label}
	</a>
</nav>
