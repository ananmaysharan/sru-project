<script lang="ts">
    import { language } from '$lib/i18n';
</script>

<section class="acknowledgements" lang={$language}>
    <div class="acknowledgements-inner">
        <h2>{$language === 'fr' ? 'Remerciements' : 'Acknowledgements'}</h2>
        <div class="acknowledgements-list">
            <div>
                <h3>{$language === 'fr' ? 'Accès aux données' : 'Data Access'}</h3>
                <p>{$language === 'fr'
                    ? 'Julie Bergeot et Clément Petitimbert, de la Mission SRU au ministère chargé du Logement'
                    : 'Julie Bergeot and Clément Petitimbert, Mission SRU at the Ministry of Housing'}</p>
            </div>
            <div>
                <h3>{$language === 'fr' ? 'Échanges et contributions à la réflexion' : 'Conversations that Informed this Project'}</h3>
                <p>
                    {#if $language === 'fr'}
                        Dr Julie Vallée, directrice de recherche au CNRS et responsable de Mobiliscope ;
                        Jacques Baudrier, Adjoint au maire de Paris chargé du logement, de la rénovation
                        thermique, de l’encadrement des loyers et de la défense des locataires ; Stéphanie
                        Jankel, Atelier parisien d’urbanisme ; Dr Lance Freeman, University of Pennsylvania ;
                        Dr Ann Forsyth, Harvard GSD – Healthy Places Design Lab ; Dr Rachel Weber, Harvard
                        GSD ; Dr Paavo Monkkonen, UCLA ; Dr Arthur Acolin, University of Washington ; Dr
                        Patrick Le Galès, CNRS – Sciences Po Paris ; Dr Rolf Pendall, AICP, University of New Mexico.
                    {:else}
                        Dr Julie Vallée, CNRS Research Director and Head of Mobiliscope; Jacques Baudrier,
                        Deputy Mayor of Paris responsible for housing, energy-efficiency renovations, rent
                        regulation, and tenants’ rights; Stéphanie Jankel, Atelier parisien d’urbanisme; Dr
                        Lance Freeman, University of Pennsylvania; Dr Ann Forsyth, Harvard GSD – Healthy
                        Places Design Lab; Dr Rachel Weber, Harvard GSD; Dr Paavo Monkkonen, UCLA; Dr Arthur
                        Acolin, University of Washington; Dr Patrick Le Galès, CNRS – Sciences Po Paris; Dr
                        Rolf Pendall, AICP, University of New Mexico.
                    {/if}
                </p>
            </div>
            <div>
                <h3>{$language === 'fr' ? 'Photographies' : 'Photography'}</h3>
                <p>
                    <strong>Paris :</strong> {$language === 'fr' ? 'toutes les images ont été réalisées en partenariat avec' : 'All images developed in partnership with'}
                    docar films (Rocío Calzado Lopez + Jasper Meurer).
                </p>
                <p>
                    <strong>{$language === 'fr' ? 'Bretagne :' : 'Brittany:'}</strong> Pierre Ewald, {$language === 'fr' ? 'pour' : 'for'} Palast.
                </p>
                <p>
                    <strong>Provence :</strong> Florence Vesval, {$language === 'fr' ? 'pour' : 'for'} Atelier
                    Régis Roudil Architectes, 2021.
                </p>
                <p>
                    <strong>{$language === 'fr' ? 'DROM :' : 'Overseas Territories:'}</strong>
                    {$language === 'fr' ? 'Images 1 à 3' : 'Images 1–3'}: L’Atelier Architectes &amp; Ingénieurs, 2018.
                    {$language === 'fr' ? 'Image 4' : 'Image 4'}: La Possession, SEMADER, AERIS/A.DISS, 2025.
                </p>
            </div>
            <div>
                <h3>{$language === 'fr' ? 'Équipe d’assistants de recherche' : 'Research Assistantship Team'}</h3>
                <p>
                    Ananmay Sharan, Sebastian Rodriguez, Matt Thibodeau, Yihan
                    Zhang, Anishta Khan
                </p>
            </div>
        </div>
    </div>
</section>

<style>
    .acknowledgements {
        padding: var(--space-lg) var(--page-gutter);
        background: #fff;
    }

    .acknowledgements-inner {
        width: min(100%, var(--measure));
        margin: 0 auto;
    }

    h2 {
        margin: 0;
        color: #111827;
        font-size: clamp(1.75rem, 2.2vw, 2.15rem);
        font-weight: 700;
        line-height: 1.2;
    }

    .acknowledgements-list {
        display: grid;
        gap: 2rem;
        margin-top: 1.75rem;
        color: #374151;
    }

    h3 {
        margin: 0;
        color: #111827;
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.4;
    }

    p {
        margin: 0.5rem 0 0;
    }
</style>
