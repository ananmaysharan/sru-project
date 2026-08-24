<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TableOfContents from '$lib/components/sections/TableOfContents.svelte';
	import PageNavigation from '$lib/components/sections/PageNavigation.svelte';
	import { afterNavigate, beforeNavigate, disableScrollHandling } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();

	// The skyline editor is a full-screen tool — hide the site chrome on it.
	const bare = $derived(page.route.id === '/skyline-editor');
	let routeScrollBehavior: string | null = null;
	const scrollPositions = new Map<string, number>();
	const scrollPositionKey = (pathname: string) => `sru-scroll:${pathname}`;

	function rememberScrollPosition(pathname: string, position: number) {
		scrollPositions.set(pathname, position);
		try {
			sessionStorage.setItem(scrollPositionKey(pathname), String(position));
		} catch {
			// In-memory restoration still works if session storage is unavailable.
		}
	}

	function savedScrollPosition(pathname: string) {
		const remembered = scrollPositions.get(pathname);
		if (remembered !== undefined) return remembered;
		try {
			const stored = sessionStorage.getItem(scrollPositionKey(pathname));
			if (stored !== null) {
				const position = Number(stored);
				if (Number.isFinite(position)) return position;
			}
		} catch {
			// A first visit should still begin at the top.
		}
		return 0;
	}

	beforeNavigate((navigation) => {
		const pathnameChanged =
			navigation.to &&
			navigation.from?.url.pathname !== navigation.to.url.pathname;
		if (!pathnameChanged) return;

		if (navigation.from) {
			rememberScrollPosition(navigation.from.url.pathname, window.scrollY);
		}
		if (navigation.to?.url.hash) return;

		const root = document.documentElement;
		routeScrollBehavior ??= root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto';
	});

	afterNavigate((navigation) => {
		const pathnameChanged =
			!navigation.from ||
			navigation.from.url.pathname !== navigation.to?.url.pathname;
		if (!pathnameChanged || navigation.to?.url.hash) return;

		disableScrollHandling();
		const root = document.documentElement;
		const previousScrollBehavior = routeScrollBehavior ?? root.style.scrollBehavior;
		const targetScrollPosition = savedScrollPosition(navigation.to?.url.pathname ?? '/');
		root.style.scrollBehavior = 'auto';
		window.scrollTo({ top: targetScrollPosition, left: 0, behavior: 'auto' });
		requestAnimationFrame(() => {
			window.scrollTo({ top: targetScrollPosition, left: 0, behavior: 'auto' });
			requestAnimationFrame(() => {
				root.style.scrollBehavior = previousScrollBehavior;
				routeScrollBehavior = null;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#ffffff" />
	<title>The Loi SRU, 25 years later</title>
</svelte:head>
{#if bare}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col">
		<a class="skip-link" href="#main-content">Skip to main content</a>
		<TableOfContents routeId={page.route.id} />
		<main id="main-content" class="flex-1" tabindex="-1">
			{@render children()}
			<PageNavigation routeId={page.route.id} />
		</main>
	</div>
{/if}
