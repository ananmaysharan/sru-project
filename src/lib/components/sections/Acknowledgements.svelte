<script lang="ts">
    import { language } from '$lib/i18n';
    import type {EditorialBlock, EditorialStory} from '$lib/utils/editorial-markdown';

    let {content}: {content: EditorialStory} = $props();

    const title = $derived(content.blocks[0] as Extract<EditorialBlock, {type: 'heading'}>);
    const groups = $derived.by(() => {
        const result: {heading: Extract<EditorialBlock, {type: 'heading'}>; paragraphs: string[]}[] = [];
        for (const block of content.blocks.slice(1)) {
            if (block.type === 'heading') {
                result.push({heading: block, paragraphs: []});
            } else if (block.type === 'paragraph') {
                result.at(-1)?.paragraphs.push(block.html);
            }
        }
        return result;
    });
</script>

<section class="acknowledgements" lang={$language}>
    <div class="acknowledgements-inner">
        <h2>{@html title.html}</h2>
        <div class="acknowledgements-list">
            {#each groups as group}
                <div>
                    <h3>{@html group.heading.html}</h3>
                    {#each group.paragraphs as paragraph}
                        <p>{@html paragraph}</p>
                    {/each}
                </div>
            {/each}
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
