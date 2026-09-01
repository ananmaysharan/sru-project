<script lang="ts">
    import { language } from '$lib/i18n';
    import type { ProjectIdCard } from '$lib/data/project-id-cards';

    let {
        card,
        onmouseenter,
        onmouseleave,
    }: {
        card: ProjectIdCard;
        onmouseenter?: () => void;
        onmouseleave?: () => void;
    } = $props();
</script>

<aside
    class="project-id-card"
    lang={$language}
    role="tooltip"
    onmouseenter={onmouseenter}
    onmouseleave={onmouseleave}
>
    <p class="project-id-card__eyebrow">
        {$language === 'fr' ? 'Fiche projet' : 'Project profile'}
    </p>
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

<style>
    .project-id-card {
        position: fixed;
        z-index: 2147483647;
        left: 50%;
        top: 4.75rem;
        width: min(32rem, calc(100vw - 2rem));
        max-height: min(38rem, calc(100vh - 6rem));
        overflow-y: auto;
        padding: 1.25rem;
        border: 1px solid #d6d6d2;
        border-top: 3px solid #6d1d3b;
        border-radius: 0;
        background: #fff;
        color: #252525;
        box-shadow: 0 12px 30px rgb(17 24 39 / 16%);
        pointer-events: auto;
        transform: translateX(-50%);
        animation: project-card-enter 140ms ease-out;
        text-align: left;
        white-space: normal;
    }

    @keyframes project-card-enter {
        from {
            opacity: 0;
            transform: translate(-50%, -0.35rem);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    .project-id-card__eyebrow {
        margin: 0 0 0.3rem;
        color: #6d1d3b;
        font-size: 0.68rem;
        font-weight: 750;
        letter-spacing: 0.08em;
        text-transform: uppercase;
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
        .project-id-card {
            left: 1rem;
            right: 1rem;
            top: 4.5rem;
            width: auto;
            max-height: calc(100svh - 5.5rem);
            transform: none;
        }

        dl > div {
            grid-template-columns: 1fr;
            gap: 0.2rem;
        }

        @keyframes project-card-enter {
            from {
                opacity: 0;
                transform: translateY(-0.35rem);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
</style>
