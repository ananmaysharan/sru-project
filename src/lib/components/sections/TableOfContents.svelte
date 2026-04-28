<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteRoutes, type SiteRoute } from '$lib/data/routes';

	let { currentPath }: { currentPath: string } = $props();

	function isActive(href: SiteRoute): boolean {
		const resolved = resolve(href);
		return currentPath === resolved || currentPath === resolved + '/';
	}
</script>

<nav class="sticky top-0 z-50 border-b bg-white" aria-label="Table of contents">
	<ul
		class="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-8 sm:overflow-visible sm:whitespace-normal sm:px-6 [&::-webkit-scrollbar]:hidden"
	>
		{#each siteRoutes as section (section.href)}
			<li class="shrink-0">
				<a
					href={resolve(section.href)}
					class="block px-3 py-4 text-sm hover:underline sm:px-5 sm:py-5 {isActive(section.href)
						? 'font-medium'
						: ''}"
				>
					{section.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
