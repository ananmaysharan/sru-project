<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TableOfContents from '$lib/components/sections/TableOfContents.svelte';
	import PageNavigation from '$lib/components/sections/PageNavigation.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex min-h-screen flex-col">
	<TableOfContents currentPath={page.url.pathname} />
	<main class="flex-1">
		{@render children()}
		<PageNavigation currentPath={page.url.pathname} />
	</main>
	<Footer />
</div>
