<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TableOfContents from '$lib/components/sections/TableOfContents.svelte';
	import PageNavigation from '$lib/components/sections/PageNavigation.svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex min-h-screen flex-col">
	<TableOfContents routeId={page.route.id} />
	<main class="flex-1">
		{@render children()}
		<PageNavigation routeId={page.route.id} />
	</main>
</div>
