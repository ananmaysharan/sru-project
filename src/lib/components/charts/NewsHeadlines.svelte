<script lang="ts">
	import { asset } from '$app/paths';
	import { Spring, prefersReducedMotion } from 'svelte/motion';

	type Headline = {
		src: string;
		alt: string;
		rotation: number;
		y: number;
	};

	const headlines: Headline[] = [
		{ src: '/headlines/March 2015.png', alt: 'March 2015 headline', rotation: -1.4, y: 10 },
		{ src: '/headlines/September 2015.png', alt: 'September 2015 headline', rotation: 1.1, y: 2 },
		{ src: '/headlines/October 2015.png', alt: 'October 2015 headline', rotation: -0.8, y: 14 },
		{ src: '/headlines/April 2016.png', alt: 'April 2016 headline', rotation: 1.5, y: 6 },
		{ src: '/headlines/April 2016 2.png', alt: 'April 2016 headline 2', rotation: -1.2, y: 16 },
		{ src: '/headlines/July 2016.png', alt: 'July 2016 headline', rotation: 0.9, y: 4 },
		{ src: '/headlines/April 2018.png', alt: 'April 2018 headline', rotation: -1.6, y: 12 },
		{ src: '/headlines/September 2018.png', alt: 'September 2018 headline', rotation: 1.3, y: 7 },
		{ src: '/headlines/December 2018.png', alt: 'December 2018 headline', rotation: -1, y: 15 },
		{ src: '/headlines/January 2019.png', alt: 'January 2019 headline', rotation: 1.6, y: 3 },
		{ src: '/headlines/September 2019.png', alt: 'September 2019 headline', rotation: -1.2, y: 10 },
		{ src: '/headlines/November 2019.png', alt: 'November 2019 headline', rotation: 0.7, y: 14 },
		{ src: '/headlines/December 2020.png', alt: 'December 2020 headline', rotation: -1.5, y: 5 },
		{ src: '/headlines/December 2020 2.png', alt: 'December 2020 headline 2', rotation: 1.2, y: 16 },
		{ src: '/headlines/November 2022.png', alt: 'November 2022 headline', rotation: -0.6, y: 8 },
		{ src: '/headlines/November 2022 2.png', alt: 'November 2022 headline 2', rotation: 1.4, y: 13 },
		{ src: '/headlines/March 2023.png', alt: 'March 2023 headline', rotation: -1.3, y: 3 },
		{ src: '/headlines/January 2024.png', alt: 'January 2024 headline', rotation: 1, y: 15 },
		{ src: '/headlines/February 2024.png', alt: 'February 2024 headline', rotation: -1.7, y: 8 },
		{ src: '/headlines/April 2024.png', alt: 'April 2024 headline', rotation: 1.3, y: 12 },
		{ src: '/headlines/April 2024 2.png', alt: 'April 2024 headline 2', rotation: -0.9, y: 2 },
		{ src: '/headlines/June 2024.png', alt: 'June 2024 headline', rotation: 1.5, y: 14 },
		{ src: '/headlines/October 2024.png', alt: 'October 2024 headline', rotation: -1.1, y: 5 }
	];

	let activeIndex = $state<number | null>(null);
	let resetTimer: ReturnType<typeof setTimeout> | null = null;
	const springs = headlines.map(() => new Spring(0, { stiffness: 0.2, damping: 0.8 }));

	function resetStack() {
		if (resetTimer) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			activeIndex = null;
			springs.forEach((spring) => {
				spring.target = 0;
			});
		}, 90);
	}

	function activate(index: number) {
		if (resetTimer) clearTimeout(resetTimer);
		activeIndex = index;
		springs.forEach((spring, springIndex) => {
			spring.target = prefersReducedMotion.current || springIndex !== index ? 0 : 1;
		});
	}
</script>

<div
	role="list"
	aria-label="Chronological news headlines"
	class="relative h-70 overflow-visible"
	onpointerleave={resetStack}
>
	{#each headlines as headline, index (headline.src)}
		{@const lift = prefersReducedMotion.current ? 0 : springs[index].current}
		{@const left = headlines.length === 1 ? 50 : 5 + (index / (headlines.length - 1)) * 90}
		<button
			type="button"
			aria-label={headline.alt}
			class="group absolute top-8 w-[clamp(7.5rem,12vw,11.5rem)] origin-center cursor-pointer border border-gray-200 bg-white p-1 shadow-[0_5px_14px_rgba(15,23,42,0.1)] outline-none transition-shadow duration-150 hover:shadow-[0_10px_24px_rgba(15,23,42,0.14)] focus-visible:ring-2 focus-visible:ring-gray-900"
			style:left="{left}%"
			style:z-index={activeIndex === index ? 100 : index}
			style:transform="translateX(-50%) translateY({headline.y}px) rotate({headline.rotation + lift * 0.25}deg) scale({1 + lift * 0.72})"
			onpointerenter={() => activate(index)}
			onpointerleave={resetStack}
			onfocus={() => activate(index)}
			onblur={resetStack}
		>
			<img
				src={asset(headline.src)}
				alt={headline.alt}
				class="block w-full select-none bg-white"
				draggable="false"
			/>
		</button>
	{/each}
</div>
