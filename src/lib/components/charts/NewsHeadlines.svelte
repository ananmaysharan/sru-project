<script lang="ts">
	import { asset } from '$app/paths';

	type Headline = {
		src: string;
		alt: string;
	};

	const headlines: Headline[] = [
		{ src: '/headlines/March 2015.png', alt: 'March 2015 headline' },
		{ src: '/headlines/September 2015.png', alt: 'September 2015 headline' },
		{ src: '/headlines/October 2015.png', alt: 'October 2015 headline' },
		{ src: '/headlines/April 2016.png', alt: 'April 2016 headline' },
		{ src: '/headlines/April 2016 2.png', alt: 'April 2016 headline 2' },
		{ src: '/headlines/July 2016.png', alt: 'July 2016 headline' },
		{ src: '/headlines/April 2018.png', alt: 'April 2018 headline' },
		{ src: '/headlines/September 2018.png', alt: 'September 2018 headline' },
		{ src: '/headlines/December 2018.png', alt: 'December 2018 headline' },
		{ src: '/headlines/January 2019.png', alt: 'January 2019 headline' },
		{ src: '/headlines/September 2019.png', alt: 'September 2019 headline' },
		{ src: '/headlines/November 2019.png', alt: 'November 2019 headline' },
		{ src: '/headlines/December 2020.png', alt: 'December 2020 headline' },
		{ src: '/headlines/December 2020 2.png', alt: 'December 2020 headline 2' },
		{ src: '/headlines/November 2022.png', alt: 'November 2022 headline' },
		{ src: '/headlines/November 2022 2.png', alt: 'November 2022 headline 2' },
		{ src: '/headlines/March 2023.png', alt: 'March 2023 headline' },
		{ src: '/headlines/January 2024.png', alt: 'January 2024 headline' },
		{ src: '/headlines/February 2024.png', alt: 'February 2024 headline' },
		{ src: '/headlines/April 2024.png', alt: 'April 2024 headline' },
		{ src: '/headlines/April 2024 2.png', alt: 'April 2024 headline 2' },
		{ src: '/headlines/June 2024.png', alt: 'June 2024 headline' },
		{ src: '/headlines/October 2024.png', alt: 'October 2024 headline' }
	];
</script>

<ul
	aria-label="Chronological news headlines"
	class="grid list-none gap-6 px-4"
	style:grid-template-columns="repeat(auto-fit, minmax(16rem, 1fr))"
>
	{#each headlines as headline (headline.src)}
		<li
			class="group relative flex aspect-[4/3] items-center justify-center border border-gray-200 bg-white p-4 shadow-sm transition-transform duration-200 ease-out hover:z-10 hover:scale-110 hover:shadow-[0_10px_24px_rgba(15,23,42,0.14)] focus-within:z-10 focus-within:scale-110"
		>
			<img
				src={asset(headline.src)}
				alt={headline.alt}
				class="max-h-full max-w-full object-contain"
				draggable="false"
				loading="lazy"
			/>
		</li>
	{/each}
</ul>
