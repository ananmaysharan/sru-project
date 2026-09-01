<script lang="ts">
	import { bibliographySectionsFr } from '$lib/data/bibliography-fr';
	import { language } from '$lib/i18n';

	const linkCls =
		'text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900';
</script>

<section id="bibliography" class="page-shell">
	<div class="prose-column">
	<h1 class="page-title">{$language === 'fr' ? 'Bibliographie' : 'Bibliography'}</h1>

	<div class="index-groups text-gray-700">
		{#if $language === 'fr'}
			{#each bibliographySectionsFr as section (section.title)}
				<section class="index-group">
					<h2>{section.title}</h2>
					<ul>
						{#each section.items as item}
							<li>
								{item.text}
								{#if item.url}
									<a href={item.url} target="_blank" rel="noreferrer" class={linkCls}>Source</a>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		{:else}
		<!-- Peer-reviewed papers -->
		<section class="index-group">
			<h2>Peer-reviewed papers</h2>
			<ul>
				<li>Monkkonen, Paavo, Magda Maaoui, and Aurora Echevarria. "<a href="https://www.anderson.ucla.edu/sites/default/files/document/2025-10/2025-09wp.pdf" target="_blank" rel="noreferrer" class={linkCls}>Fair housing or the right to housing? Comparing policies and frames in France, the United States, and Mexico</a>", <em>UCLA Ziman Center for Real Estate Working Papers</em>, October 2025.</li>
				<li>Whitney Airgood-Obrycki, Magda Maaoui, and Sophia Wedeen. "<a href="https://www.tandfonline.com/doi/full/10.1080/07352166.2025.2455606?scroll=top&amp;needAccess=true" target="_blank" rel="noreferrer" class={linkCls}>Rental Deserts, Segregation, and Zoning</a>", <em>Journal of Urban Affairs</em>, February 2025.</li>
				<li>Lance Freeman and Magda Maaoui. "<a href="https://www.lincolninst.edu/es/publications/working-papers/inclusionary-zoning-in-new-york-paris" target="_blank" rel="noreferrer" class={linkCls}>Inclusionary Zoning in New York and Paris: Trojan horse or Antidote to Gentrification?</a>", <em>Lincoln Institute of Land Policy Working Paper</em>, June 2022.</li>
				<li>Maaoui, Magda. "<a href="https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790" target="_blank" rel="noreferrer" class={linkCls}>The SRU Law, twenty years later: evaluating the legacy of France's most important social housing program</a>", <em>Housing Studies</em>, August 2021.</li>
				<li>Maaoui, Magda. "<a href="https://metropolitics.org/In-Search-of-Grand-Paris-Pierre-Mansat-on-the-Eve-of-the-June-2020-Municipal.html" target="_blank" rel="noreferrer" class={linkCls}>In Search of the Grand Paris: an Interview with Pierre Mansat on the Eve of the June 2020 municipal elections</a>", <em>Metropolitics - Métropolitiques</em>, June 2020.</li>
			</ul>
		</section>

		<!-- Book chapters -->
		<section class="index-group">
			<h2>Book chapters</h2>
			<ul>
				<li>Maaoui, Magda. 2026. "The Pleasure of Living: Renée Gailhoustet's Vision of Healthy Housing / Plaisir d'habiter : la vision de Renée Gailhoustet en faveur d'un habitat sain", in <em>Renée Gailhoustet</em> [editor: Barrington-Leach], London: Architectural Association Publications.</li>
				<li>Maaoui, Magda (2020). "The SRU Law: When French Zoning Says No to Inclusion" [Pop-out Case], in <em><a href="https://www.routledge.com/Zoning-A-Guide-for-21st-Century-Planning/Sclar-Baird-Zars-Fischer-Stahl/p/book/9781138593886" target="_blank" rel="noreferrer" class={linkCls}>Zoning: A Guide for 21st-Century Planning</a></em> [editors: Sclar, Stahl, Baird-Zars], Routledge.</li>
				<li>Maaoui, Magda, et al. (Preface). <em><a href="https://archicity.fr/edition-pour-en-finir-avec-le-petit-paris/" target="_blank" rel="noreferrer" class={linkCls}>Pour en finir avec le petit Paris</a></em>, Paris: Archicity, November 2024.</li>
			</ul>
		</section>

		<!-- Planning reports -->
		<section class="index-group">
			<h2>Planning reports</h2>
			<ul>
				<li>Contribution to the APUR Executive Report "Inégalités sociales et territoriales de santé dans la Métropole du Grand Paris", Paris, October 2023.</li>
				<li>Contribution to the APUR Report "Recours aux soins et aux dispositifs de prévention : Inégalités sociales et territoriales de santé dans la Métropole du Grand Paris", Paris, October 2023.</li>
				<li>Contribution to the APUR Report "<a href="https://www.apur.org/sites/default/files/inegalites_sante_volet02_actions-sante-publique.pdf?token=txqATjHG" target="_blank" rel="noreferrer" class={linkCls}>Actions en santé publique : sensibilisation, promotion et prévention</a>", Paris, May 2023.</li>
				<li>Contribution to the APUR Report "L'offre de soins dans la Métropole du Grand Paris : Inégalités sociales et territoriales de santé", Paris, March 2023.</li>
			</ul>
		</section>

		<!-- Media articles -->
		<section class="index-group">
			<h2>Media articles</h2>
			<ul>
				<li>Maaoui, Magda, Krista Sykes, Chris Herbert, Susanne Schindler, and Becca Heilman. "<a href="https://www.harvarddesignmagazine.org/articles/social-housing-reconsidered/" target="_blank" rel="noreferrer" class={linkCls}>Social Housing, Reconsidered</a>". <em>Harvard Design Magazine Digital</em>, April 2026.</li>
				<li>Maaoui, Magda. "<a href="https://www.jchs.harvard.edu/blog/pleasure-living-lessons-france-us-social-housing" target="_blank" rel="noreferrer" class={linkCls}>The Pleasure of Living: Lessons from France for US Social Housing</a>", <em>Housing Perspectives - Joint Center for Housing Studies</em> (posted April 7, 2026).</li>
				<li>Maaoui, Magda et al. (Tous Grands Parisiens). "<a href="https://www.lemonde.fr/idees/article/2026/01/29/elections-municipales-2026-nous-pensons-qu-il-est-temps-d-elire-un-ou-une-maire-du-grand-paris_6664644_3232.html" target="_blank" rel="noreferrer" class={linkCls}>Nous pensons qu'il est temps d'élire un ou une maire du Grand Paris</a>", <em>Le Monde</em> (Op-Ed posted January 29, 2026).</li>
				<li>Maaoui, Magda. "<a href="https://www.architectural-review.com/buildings/housing/social-contract-parisian-social-housing" target="_blank" rel="noreferrer" class={linkCls}>Social contract: Parisian social housing</a>", <em>The Architectural Review</em> (France issue posted June 30, 2022). [Top 20 Architectural Review articles of 2022]</li>
				<li>Maaoui, Magda. "Logement social : La Loi SRU menacée par le projet 3DS ?", <em>Bondy Blog</em> (posted December 17, 2021).</li>
				<li>Pierre Mansat, Maaoui, Magda et al. "<a href="https://www.lemonde.fr/idees/article/2021/06/24/la-metropole-du-grand-paris-parait-inoperante-pour-gerer-un-espace-de-12-millions-d-habitants_6085440_3232.html" target="_blank" rel="noreferrer" class={linkCls}>La Métropole du Grand Paris paraît inopérante pour gérer un espace de 12 millions d'habitants</a>". <em>Le Monde</em> (Op-ed posted June 24, 2021).</li>
				<li>Pierre Mansat, Maaoui, Magda et al. "Élections régionales en Île-de-France : 'Les débats de fond concernant l'avenir de la région métropolitaine parisienne ne sont jamais abordés'". <em>Le Monde</em> (Op-ed posted April 25, 2021).</li>
				<li>Maaoui, Magda. "<a href="https://www.bondyblog.fr/societe/la-cite-confinee-a-la-lumiere-de-la-rythmanalyse/" target="_blank" rel="noreferrer" class={linkCls}>La cité confinée à la lumière de la rythmanalyse</a>", <em>Bondy Blog</em> (Op-ed posted May 11, 2020).</li>
				<li>Pierre Mansat, Maaoui, Magda et al. "<a href="https://www.lemonde.fr/idees/article/2020/02/19/avec-le-grand-paris-le-temps-de-la-citoyennete-metropolitaine-est-venu_6030028_3232.html" target="_blank" rel="noreferrer" class={linkCls}>Avec le Grand Paris, le temps de la citoyenneté métropolitaine est venu</a>". <em>Le Monde</em> (Op-ed posted February 19, 2020).</li>
				<li>Maaoui, Magda. "<a href="https://www.bondyblog.fr/culture/les-miserables-aux-oscars-pour-mettre-les-mauvais-cultivateurs-des-quartiers-au-banc-des-accuses/" target="_blank" rel="noreferrer" class={linkCls}>Les Misérables aux Oscars, pour mettre les mauvais cultivateurs des quartiers au banc des accusés</a>", <em>Bondy Blog</em> (Op-ed posted February 8, 2020).</li>
				<li>Maaoui, Magda. "<a href="https://issuu.com/gsapp_hp/docs/urbanmag" target="_blank" rel="noreferrer" class={linkCls}>Changing Peripheries: the Obduracy of Buildings (and People who live in them)</a>", <em>URBAN Magazine</em>, Columbia University GSAPP: Volume 29, Fall 2019.</li>
			</ul>
		</section>

		<!-- Podcasts -->
		<section class="index-group">
			<h2>Podcasts</h2>
			<ul>
				<li>Podcast episode on <a href="https://open.spotify.com/episode/1gY0oTV7r6UvB1jdTnFaky" target="_blank" rel="noreferrer" class={linkCls}>Housing After Dark</a> "Drawing lessons from the French model of housing provision to address California's housing crisis"</li>
				<li>Interview on Housing Voice about the 20-year legacy of France's SRU Law for mandatory social housing construction "<a href="https://www.lewis.ucla.edu/2022/02/16/episode-20-social-housing-in-france-with-magda-maaoui/" target="_blank" rel="noreferrer" class={linkCls}>Social Housing in France</a>" - UCLA Lewis Center</li>
			</ul>
		</section>

		<!-- Exhibitions -->
		<section class="index-group">
			<h2>Exhibitions</h2>
			<ul>
				<li><a href="https://www.aaschool.ac.uk/publicprogramme/whatson/renee-gailhoustet-a-thousand-and-one-ways-of-living" target="_blank" rel="noreferrer" class={linkCls}>Exhibition</a> coordinated by the architectural agency NVBL in parallel to the book launch of Renée Gailhoustet - Architectural Association exhibition gallery (London).</li>
			</ul>
		</section>

		<!-- Media mentions -->
		<section class="index-group">
			<h2>Media mentions of my work</h2>
			<ul>
				<li>"<a href="https://www.theguardian.com/artanddesign/2026/feb/10/riotous-post-apocalyptic-eco-brutalist-renee-gailhoustet" target="_blank" rel="noreferrer" class={linkCls}>Back gardens in the sky! The riotous, post-apocalyptic buildings of 'eco-brutalist' Renée Gailhoustet</a>", <em>The Guardian</em> (posted February 10, 2026).</li>
				<li>"<a href="https://www.dezeen.com/2026/01/23/renee-gailhoustet-exhibition-architectural-association/" target="_blank" rel="noreferrer" class={linkCls}>Full-scale paper replica of Renée Gailhoustet apartment installed at London's Architectural Association</a>", <em>Dezeen</em> (posted January 23, 2026).</li>
				<li>"<a href="https://www.wallpaper.com/architecture/renee-gailhoustet-exhibition-aa-london-uk" target="_blank" rel="noreferrer" class={linkCls}>Discover Renée Gailhoustet and her radical approach to socially engaged housing</a>", <em>Wallpaper</em> (posted January 23, 2026).</li>
				<li>"<a href="https://www.worldofinteriors.com/story/renee-gailhoustet-a-thousand-and-one-ways-of-living-architecture" target="_blank" rel="noreferrer" class={linkCls}>Paint the Town Red</a>", <em>The World of Interiors</em> (posted January 17, 2026).</li>
				<li>"<a href="https://www.lagrandeconversation.com/societe/en-2026-le-grand-paris-a-besoin-dun-projet-commun/" target="_blank" rel="noreferrer" class={linkCls}>En 2026, le Grand Paris a besoin d'un projet commun</a>", <em>La Grande Conversation</em> (posted January 21, 2025).</li>
				<li>"<a href="https://www.liberation.fr/international/amerique/incendies-a-los-angeles-les-constructions-en-bois-bouc-emissaire-des-negligences-durbanisme-20250115_OFQKOYGKA5AX7ADMP64LFYCBFY/?datawallToken=GFT-78f1d9a61700db9f057028ac46064cbb" target="_blank" rel="noreferrer" class={linkCls}>Incendies à Los Angeles : les constructions en bois, boucs émissaires des négligences d'urbanisme</a>", <em>Libération</em> (posted January 15, 2025).</li>
				<li>"<a href="https://localnewsmatters.org/2025/01/14/what-france-got-right-about-social-housing-and-the-lessons-for-california-urban-planners/" target="_blank" rel="noreferrer" class={linkCls}>What France got right about social housing—and the lessons for California urban planners</a>", <em>Bay Area Local News Matters</em> (posted January 14, 2025).</li>
				<li>"<a href="https://www.lemonde.fr/idees/article/2024/03/12/logement-social-le-gouvernement-remet-en-cause-l-objectif-de-mixite_6221580_3232.html" target="_blank" rel="noreferrer" class={linkCls}>Logement social: l'exécutif remet en cause l'objectif de mixité</a>", <em>Le Monde</em> (posted March 13, 2024).</li>
				<li>"<a href="https://www.liberation.fr/societe/sante/les-patients-en-affection-longue-duree-surrepresentes-dans-les-zones-pauvres-du-grand-paris-20231019_WGZKTEDBFNAXZFQT2IJJCGCULM/" target="_blank" rel="noreferrer" class={linkCls}>Les patients en affection longue durée surreprésentés dans les zones pauvres du Grand Paris</a>", <em>Libération</em> (posted October 19, 2023).</li>
				<li>"<a href="https://actu.fr/ile-de-france/paris_75056/carte-dans-quel-quartier-de-paris-trouve-t-on-le-plus-de-medecins_58645188.html" target="_blank" rel="noreferrer" class={linkCls}>Dans quel quartier de Paris trouve-t-on le plus de médecins ?</a>", <em>Actualités de Paris</em> (posted April 3, 2023).</li>
				<li>"Déserts médicaux : quelles villes des Hauts-de-Seine ont le plus de médecins", <em>Actualités des Hauts-de-Seine</em> (posted April 3, 2023).</li>
				<li>"Logement social : ce que le modèle de Rennes peut inspirer aux autres communes", <em>Envies de Ville - Nexity</em> (posted March 3, 2022).</li>
				<li>"Logement social. 'Rennes est un modèle à copier'", <em>Ouest-France</em> (posted January 4, 2022).</li>
				<li>"<a href="https://www.lagazettedescommunes.com/765814/les-sanctions-de-la-loi-sru-nont-pas-deffet-incitatif/" target="_blank" rel="noreferrer" class={linkCls}>Les sanctions de la Loi SRU n'ont pas d'effet incitatif</a>", <em>La Gazette des Communes</em> (posted October 1, 2021).</li>
			</ul>
		</section>
		{/if}

	</div>
	</div>
</section>
