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
	<ul class="mx-auto flex max-w-5xl items-center justify-center">
		{#each siteRoutes as section (section.href)}
			<li>
				<a
					href={resolve(section.href)}
					class="block px-4 py-3 text-sm hover:underline {isActive(section.href)
						? 'font-medium'
						: ''}"
				>
					{section.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
