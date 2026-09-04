<script lang="ts">
    import { language } from '$lib/i18n';
    import type { ProjectIdCard } from '$lib/data/project-id-cards';
    import { Portal } from 'bits-ui';
    import { positionProjectCard, type ProjectCardAnchor } from './project-card-position';

    let {
        card,
        anchor,
        onmouseenter,
        onmouseleave,
    }: {
        card: ProjectIdCard;
        anchor: ProjectCardAnchor;
        onmouseenter?: () => void;
        onmouseleave?: () => void;
    } = $props();

    let viewportWidth = $state(0);
    let viewportHeight = $state(0);
    let cardWidth = $state(0);
    let cardHeight = $state(0);
    const position = $derived(positionProjectCard(
        anchor,
        { width: viewportWidth, height: viewportHeight },
        { width: cardWidth, height: cardHeight },
    ));
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<Portal>
    <aside
        id="case-study-project-profile"
        class="project-id-card"
        bind:offsetWidth={cardWidth}
        bind:offsetHeight={cardHeight}
        style:left={`${position.left}px`}
        style:top={`${position.top}px`}
        style:max-height={`${position.maxHeight}px`}
        style:visibility={cardWidth && cardHeight ? 'visible' : 'hidden'}
        lang={$language}
        role="tooltip"
        onmouseenter={onmouseenter}
        onmouseleave={onmouseleave}
    >
        <h3>{card.title[$language]}</h3>
        <dl>
            {#each card.fields as field (`${field.label.en}-${field.value.en}`)}
                <div>
                    <dt>{field.label[$language]}</dt>
                    <dd>{field.value[$language]}</dd>
                </div>
            {/each}
        </dl>
    </aside>
</Portal>

<style>
    .project-id-card {
        position: fixed;
        z-index: 2147483647;
        box-sizing: border-box;
        width: min(32rem, calc(100vw - 24px));
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 1.25rem;
        border: 1px solid #d6d6d2;
        border-radius: 0;
        background: #fff;
        color: #252525;
        box-shadow: 0 12px 30px rgb(17 24 39 / 16%);
        pointer-events: auto;
        text-align: left;
        white-space: normal;
    }

    h3 {
        margin: 0 0 0.15rem;
        color: #111827;
        font-size: 1.2rem;
        font-weight: 750;
        line-height: 1.25;
        text-wrap: balance;
    }

    dl {
        margin: 1rem 0 0;
        border-top: 1px solid #e2e2df;
    }

    dl > div {
        display: grid;
        grid-template-columns: minmax(8.5rem, 0.85fr) minmax(0, 1.4fr);
        gap: 1rem;
        padding-block: 0.65rem;
        border-bottom: 1px solid #e2e2df;
    }

    dl > div:last-child {
        border-bottom: 0;
    }

    dt {
        color: #4b5563;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    dd {
        margin: 0;
        color: #252525;
        font-size: 0.82rem;
        line-height: 1.45;
    }

    @media (max-width: 639.98px) {
        dl > div {
            grid-template-columns: 1fr;
            gap: 0.2rem;
        }
    }
</style>
