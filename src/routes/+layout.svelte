<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TableOfContents from '$lib/components/sections/TableOfContents.svelte';
	import PageNavigation from '$lib/components/sections/PageNavigation.svelte';
	import Glossary from '$lib/components/sections/Glossary.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	// The skyline editor is a full-screen tool — hide the site chrome on it.
	const bare = $derived(page.route.id === '/skyline-editor');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#if bare}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col">
		<TableOfContents routeId={page.route.id} />
		<main class="flex-1">
			{@render children()}
			<PageNavigation routeId={page.route.id} />
			{#if page.route.id === '/'}
				<Glossary />
			{/if}
		</main>
	</div>
{/if}
