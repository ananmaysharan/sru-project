<script lang="ts">
	import { language } from '$lib/i18n';
</script>

<div lang={$language}>
	<h2 class="text-xl font-bold text-gray-900">
		{$language === 'fr' ? 'Lexique du tableau de bord' : 'Dashboard lexicon'}
	</h2>

	<div class="mt-4 space-y-4 text-gray-700">
		{#if $language === 'fr'}
			<p>
				<strong>Parc locatif social :</strong> le répertoire du parc locatif des bailleurs sociaux
				(RPLS) recense l’ensemble des logements appartenant aux organismes de logement social. Le
				parc locatif social comprend tous les logements, qu’ils soient ou non conventionnés avec
				l’État, dont le statut juridique du propriétaire encadre l’activité (offices publics de
				l’habitat, entreprises sociales pour l’habitat et associations agréées) ainsi que les
				logements conventionnés appartenant à d’autres bailleurs (sociétés d’économie mixte,
				notamment). En revanche, les logements non conventionnés appartenant à une société
				d’économie mixte (SEM) en France métropolitaine, dont les caractéristiques sont proches de
				celles du parc locatif privé, sont exclus.
			</p>

			<p>
				<strong>Quartier prioritaire de la politique de la ville (QPV) :</strong> la loi de
				programmation pour la ville et la cohésion urbaine, dite loi Lamy, a modifié la géographie
				des quartiers prioritaires de la politique de la ville. Les QPV ont remplacé les zones
				urbaines sensibles (ZUS) et les quartiers couverts par un contrat urbain de cohésion
				sociale (CUCS) en janvier 2015. Ainsi, dans le répertoire, l’appartenance à un QPV a
				remplacé l’appartenance à une ZUS à compter du 1er janvier 2016.
			</p>
		{:else}
			<p>
				<strong>Social rental housing stock:</strong> the register of the rental stock of social
				housing providers lists all dwellings owned by social landlords. The social rental housing
				stock refers to all dwellings, whether or not they are under a convention with the state,
				for which the landlord's legal status constrains its activity (public housing offices,
				social housing enterprises, accredited associations), plus conventioned dwellings owned by
				other providers (semi‑public companies, etc.). Non‑conventioned dwellings owned by a
				semi‑public company (SEM) in metropolitan France whose characteristics are close to the
				private rental sector are therefore excluded.
			</p>

			<p>
				<strong>Priority urban policy neighborhood (QPV):</strong> the Framework Law on Urban Policy
				and Social Cohesion changed the geography of priority areas for urban policy. The priority
				neighborhoods of urban policy (QPV) replaced the zones urbaines sensibles (ZUS, sensitive
				urban zones) and the neighborhoods under an Urban Social Cohesion Contract (CUCS) in January
				2015. Thus, belonging to a QPV replaced belonging to a ZUS in the register as of January 1,
				2016.
			</p>
		{/if}

		<div>
			<p class="font-semibold text-gray-900">
				{$language === 'fr' ? 'Dispositifs de financement' : 'Financing instruments:'}
			</p>
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li><strong>PLAI</strong> = {$language === 'fr' ? 'prêt locatif aidé d’intégration' : "Prêt locatif aidé d'intégration (integrative assisted rental loan)"};</li>
				<li>
					<strong>PLUS</strong> = {$language === 'fr'
						? 'prêt locatif à usage social. Les logements financés au moyen d’un prêt locatif aidé ordinaire (PLA) sont également inclus dans cette catégorie'
						: 'Prêt locatif à usage social (social use rental loan). Dwellings financed with an ordinary assisted rental loan (Prêt locatif aidé ordinaire, PLA) are also included in this category'};
				</li>
				<li><strong>PLS</strong> = {$language === 'fr' ? 'prêt locatif social' : 'Prêt locatif social (social rental loan)'};</li>
				<li><strong>PLI</strong> = {$language === 'fr' ? 'prêt locatif intermédiaire' : 'Prêt locatif intermédiaire (intermediate rental loan)'}.</li>
			</ul>
		</div>

		<div>
			<p class="font-semibold text-gray-900">
				{$language === 'fr' ? 'Types de bailleurs sociaux' : 'Types of social housing providers:'}
			</p>
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li><strong>OPH</strong> = {$language === 'fr' ? 'office public de l’habitat' : "Organisme public de l'habitat (public housing agency)"};</li>
				<li><strong>ESH</strong> = {$language === 'fr' ? 'entreprise sociale pour l’habitat' : "Entreprise sociale pour l'habitat (social housing enterprise)"};</li>
				<li><strong>SEM</strong> = {$language === 'fr' ? 'société d’économie mixte' : "Société d'économie mixte (semi‑public/municipally controlled company)"}.</li>
			</ul>
		</div>
	</div>
</div>
