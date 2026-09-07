<script lang="ts">
    import type { BibliographySegment } from '$lib/data/bibliography-fr';
    import { language } from '$lib/i18n';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const text = $derived({
        title: data.content.title[$language],
        sections: data.content.sections[$language],
    });

    const linkCls =
        'text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900';
</script>

{#snippet formattedSegment(segment: BibliographySegment)}
    {#if segment.bold && segment.italic}<strong><em>{segment.text}</em></strong>{:else if segment.bold}<strong>{segment.text}</strong>{:else if segment.italic}<em>{segment.text}</em>{:else}{segment.text}{/if}
{/snippet}

<section id="bibliography" class="page-shell">
    <div class="prose-column">
        <h1 class="page-title">{text.title}</h1>

        <div class="index-groups text-gray-700">
            {#each text.sections as section (section.id)}
                <section class="index-group">
                    <h2>{section.title}</h2>
                    <ul>
                        {#each section.items as item (item.id)}
                            <li>
                                {#each item.segments as segment}{#if segment.href}<a href={segment.href} target="_blank" rel="noopener noreferrer" class={linkCls}>{@render formattedSegment(segment)}</a>{:else}{@render formattedSegment(segment)}{/if}{/each}
                            </li>
                        {/each}
                    </ul>
                </section>
            {/each}
        </div>
    </div>
</section>
