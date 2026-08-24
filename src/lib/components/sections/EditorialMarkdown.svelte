<script lang="ts">
    import {
        parseEditorialStory,
        type EditorialSectionKey,
    } from "$lib/utils/editorial-markdown";

    let {
        source,
        section,
        compact = false,
        render = "all",
    }: {
        source: string;
        section: EditorialSectionKey;
        compact?: boolean;
        render?: "all" | "content" | "notes";
    } = $props();

    const story = $derived(parseEditorialStory(source, section));

    const sectionLabels: Record<EditorialSectionKey, string> = {
        introduction: "Introduction project essay",
        "dashboard-guide": "Using the dashboard",
        supply: "Methods and stance project essay",
        "health-chart": "Health chart guidance",
        "health-method": "Health methods note",
        "post-occupancy": "Housing regimes project essay",
    };
</script>

<section
    id={render === "notes" ? `editorial-${section}-notes` : `editorial-${section}`}
    class:compact
    class="editorial-section"
    aria-label={sectionLabels[section]}
>
    <article class="editorial-article">
        {#if render !== "notes"}
            {#each story.blocks as block}
                {#if block.type === "heading" && block.level === 2}
                    <h2 id={block.id}>{@html block.html}</h2>
                {:else if block.type === "heading"}
                    <h3 id={block.id}>{@html block.html}</h3>
                {:else if block.type === "paragraph"}
                    <p>{@html block.html}</p>
                {:else if block.ordered}
                    <ol>
                        {#each block.items as item}
                            <li>{@html item}</li>
                        {/each}
                    </ol>
                {:else}
                    <ul>
                        {#each block.items as item}
                            <li>{@html item}</li>
                        {/each}
                    </ul>
                {/if}
            {/each}
        {/if}

        {#if render !== "content" && story.notes.length}
            <aside class="editorial-notes" role="doc-endnotes" aria-label="Footnotes">
                <ol start={story.notes[0].number}>
                    {#each story.notes as note}
                        <li id={`editorial-${section}-note-${note.number}`} value={note.number}>
                            <span>{@html note.html}</span>
                            <a
                                class="editorial-note-backlink"
                                href={`#editorial-${section}-noteref-${note.number}`}
                                aria-label={`Back to footnote reference ${note.number}`}
                                >↩</a
                            >
                        </li>
                    {/each}
                </ol>
            </aside>
        {/if}
    </article>
</section>

<style>
    .editorial-section {
        scroll-margin-top: 4.5rem;
        padding: var(--space-xl) var(--page-gutter) var(--space-lg);
        background: #fff;
    }

    .editorial-section.compact {
        padding-top: var(--space-lg);
        padding-bottom: var(--space-lg);
    }

    .editorial-article {
        /* Match the readable width of `max-w-3xl px-4 sm:px-6` prose
           containers used by the surrounding route sections. */
        width: min(100%, var(--measure));
        margin: 0 auto;
        color: #252525;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        text-wrap: pretty;
    }

    .editorial-article h2 {
        scroll-margin-top: 6rem;
        margin: clamp(3rem, 5vw, 4rem) 0 1rem;
        color: #111;
        font-family: "Open Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: clamp(1.75rem, 1.45rem + 0.9vw, 2.35rem);
        font-weight: 750;
        line-height: 1.12;
        letter-spacing: -0.035em;
        text-wrap: balance;
    }

    .editorial-article > h2:first-child {
        margin-top: 0;
    }

    .editorial-article h3 {
        margin: clamp(2rem, 3.5vw, 2.75rem) 0 0.65rem;
        color: #181818;
        font-size: 1.15em;
        font-style: normal;
        font-weight: 700;
        line-height: 1.35;
    }

    .editorial-article p {
        margin: 0 0 1.25rem;
    }

    .editorial-article ul,
    .editorial-article ol {
        margin: 0.25rem 0 1.4rem;
        padding-left: 1.4rem;
    }

    .editorial-article ul {
        list-style: disc;
    }

    .editorial-article ol {
        list-style: decimal;
    }

    .editorial-article li {
        margin: 0.55rem 0;
        padding-left: 0.35rem;
    }

    .editorial-article :global(em) {
        font-style: italic;
    }

    .editorial-article :global(a) {
        color: inherit;
        text-decoration-line: underline;
        text-decoration-color: #9ca3af;
        text-decoration-thickness: 1px;
        text-underline-offset: 0.18em;
        transition: text-decoration-color 150ms ease;
    }

    .editorial-article :global(a:hover) {
        text-decoration-color: #111;
    }

    .editorial-article :global(.editorial-noteref) {
        margin-left: 0.08em;
        font-family: "Open Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 0.62em;
        font-weight: 700;
        line-height: 0;
        vertical-align: super;
    }

    .editorial-article :global(.editorial-noteref a) {
        text-decoration: none;
    }

    .editorial-notes {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #b9b9b9;
        color: #4b4b4b;
        font-family: "Open Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 0.84rem;
        line-height: 1.55;
    }

    .editorial-notes ol {
        margin: 0;
        padding-left: 1.3rem;
    }

    .editorial-notes li {
        scroll-margin-top: 6rem;
        margin: 0 0 0.85rem;
        padding-left: 0.3rem;
    }

    .editorial-note-backlink {
        margin-left: 0.35rem;
        font-size: 0.9em;
        text-decoration: none !important;
    }

    @media (max-width: 639.98px) {
        .editorial-section {
            padding: var(--space-lg) 1rem;
        }

        .editorial-article h2 {
            margin-top: 2.75rem;
        }
    }
</style>
