import {parseFragment} from 'parse5';
import type {EditorialStory} from '../../src/lib/utils/editorial-markdown';

type HtmlNode = {
    nodeName: string;
    value?: string;
    tagName?: string;
    attrs?: {name: string; value: string}[];
    childNodes?: HtmlNode[];
};

type MarkDefinition = {
    _key: string;
    _type: 'externalLink' | 'noteReference';
    href?: string;
    noteId?: string;
    number?: number;
};

function attribute(node: HtmlNode, name: string) {
    return node.attrs?.find((item) => item.name === name)?.value;
}

function textContent(node: HtmlNode): string {
    if (node.nodeName === '#text') return node.value ?? '';
    return (node.childNodes ?? []).map(textContent).join('');
}

function htmlToSpans(html: string, blockKey: string) {
    const fragment = parseFragment(html) as unknown as HtmlNode;
    const spans: {_key: string; _type: 'span'; text: string; marks: string[]}[] = [];
    const markDefs: MarkDefinition[] = [];
    let linkIndex = 0;

    function addText(text: string, marks: string[]) {
        if (text === '') return;
        spans.push({
            _key: `${blockKey}-span-${spans.length + 1}`,
            _type: 'span',
            text,
            marks,
        });
    }

    function walk(node: HtmlNode, marks: string[]) {
        if (node.nodeName === '#text') {
            addText(node.value ?? '', marks);
            return;
        }
        if (node.nodeName === '#document-fragment') {
            for (const child of node.childNodes ?? []) walk(child, marks);
            return;
        }
        if (node.tagName === 'strong' || node.tagName === 'em') {
            for (const child of node.childNodes ?? []) walk(child, [...marks, node.tagName]);
            return;
        }
        if (node.tagName === 'a') {
            const href = attribute(node, 'href');
            if (!href || href.startsWith('#')) throw new Error(`Unexpected editorial link in ${blockKey}.`);
            linkIndex += 1;
            const markKey = `${blockKey}-link-${linkIndex}`;
            markDefs.push({_key: markKey, _type: 'externalLink', href});
            for (const child of node.childNodes ?? []) walk(child, [...marks, markKey]);
            return;
        }
        if (node.tagName === 'sup') {
            const link = node.childNodes?.find((child) => child.tagName === 'a');
            const href = link ? attribute(link, 'href') : undefined;
            const number = Number(textContent(node));
            if (!href?.startsWith('#') || !Number.isInteger(number)) {
                throw new Error(`Invalid editorial note reference in ${blockKey}.`);
            }
            const noteId = href.slice(1);
            const markKey = `${blockKey}-note-${number}`;
            markDefs.push({_key: markKey, _type: 'noteReference', noteId, number});
            addText(String(number), [...marks, markKey]);
            return;
        }
        throw new Error(`Unsupported <${node.tagName ?? node.nodeName}> element in ${blockKey}.`);
    }

    walk(fragment, []);
    return {children: spans, markDefs};
}

function portableBlock(
    html: string,
    blockKey: string,
    options: {style?: 'normal' | 'h2' | 'h3'; listItem?: 'bullet' | 'number'} = {},
) {
    return {
        _key: blockKey,
        _type: 'block' as const,
        style: options.style ?? 'normal',
        ...(options.listItem ? {listItem: options.listItem, level: 1} : {}),
        ...htmlToSpans(html, blockKey),
    };
}

export function editorialStoryToPortableText(story: EditorialStory, language: 'en' | 'fr', section: string) {
    const scope = `editorial-${section}`;
    const blocks = story.blocks.flatMap((block, blockIndex) => {
        const fallbackKey = `${scope}-${language}-block-${blockIndex + 1}`;
        if (block.type === 'heading') {
            return [portableBlock(block.html, block.id, {style: block.level === 2 ? 'h2' : 'h3'})];
        }
        if (block.type === 'paragraph') return [portableBlock(block.html, fallbackKey)];
        return block.items.map((item, itemIndex) =>
            portableBlock(item, `${fallbackKey}-item-${itemIndex + 1}`, {
                listItem: block.ordered ? 'number' : 'bullet',
            }),
        );
    });

    const endnotes = story.notes.map((note) => {
        const noteId = `${scope}-note-${note.number}`;
        return {
            _key: noteId,
            _type: 'endnote' as const,
            noteId,
            number: note.number,
            body: [portableBlock(note.html, `${noteId}-body`)],
        };
    });

    return {blocks, endnotes};
}
