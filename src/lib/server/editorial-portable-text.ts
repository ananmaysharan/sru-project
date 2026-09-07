import type {EditorialBlock, EditorialStory} from '$lib/utils/editorial-markdown';

type PortableTextSpan = {
    _type: 'span';
    text: string;
    marks?: string[];
};

type PortableTextMarkDefinition = {
    _key: string;
    _type: 'externalLink' | 'noteReference';
    href?: string;
    noteId?: string;
    number?: number;
};

export type PortableTextBlock = {
    _key: string;
    _type: 'block';
    style?: string;
    listItem?: string;
    level?: number;
    children?: PortableTextSpan[];
    markDefs?: PortableTextMarkDefinition[];
};

export type PortableTextEndnote = {
    noteId: string;
    number: number;
    body: PortableTextBlock[];
};

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

function validateLink(href: unknown, path: string): asserts href is string {
    if (typeof href !== 'string') throw new Error(`Missing editorial link at ${path}.`);
    const parsed = new URL(href);
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        throw new Error(`Unsupported editorial link protocol at ${path}.`);
    }
}

function inlineHtml(block: PortableTextBlock, path: string) {
    if (!Array.isArray(block.children) || block.children.length === 0) {
        throw new Error(`Editorial block ${path} has no text.`);
    }

    const definitions = new Map((block.markDefs ?? []).map((definition) => [definition._key, definition]));
    const usedDefinitions = new Set<string>();
    const html = block.children.map((child, spanIndex) => {
        if (child?._type !== 'span' || typeof child.text !== 'string') {
            throw new Error(`Editorial span ${path}.${spanIndex + 1} is invalid.`);
        }

        let output = escapeHtml(child.text);
        for (const mark of [...(child.marks ?? [])].reverse()) {
            if (mark === 'strong') {
                output = `<strong>${output}</strong>`;
                continue;
            }
            if (mark === 'em') {
                output = `<em>${output}</em>`;
                continue;
            }

            const definition = definitions.get(mark);
            if (!definition) throw new Error(`Editorial span ${path}.${spanIndex + 1} has an unknown mark.`);
            usedDefinitions.add(mark);
            if (definition._type === 'externalLink') {
                validateLink(definition.href, `${path}.${mark}`);
                output = `<a href="${escapeHtml(definition.href)}" target="_blank" rel="noreferrer">${output}</a>`;
                continue;
            }
            if (definition._type === 'noteReference') {
                if (typeof definition.noteId !== 'string' || !Number.isInteger(definition.number)) {
                    throw new Error(`Editorial note reference ${path}.${mark} is invalid.`);
                }
                const referenceId = definition.noteId.replace('-note-', '-noteref-');
                output = `<sup class="editorial-noteref" role="doc-noteref"><a id="${referenceId}" href="#${definition.noteId}" aria-label="Footnote ${definition.number}">${output}</a></sup>`;
                continue;
            }
            throw new Error(`Editorial mark ${path}.${mark} is not supported.`);
        }
        return output;
    }).join('');

    if (usedDefinitions.size !== definitions.size) {
        throw new Error(`Editorial block ${path} contains an unused annotation.`);
    }
    if (html.trim() === '') throw new Error(`Editorial block ${path} is empty.`);
    return html;
}

function validateStructure(actual: EditorialStory, expected: EditorialStory, scope: string) {
    if (actual.blocks.length !== expected.blocks.length) {
        throw new Error(`Expected ${expected.blocks.length} ${scope} blocks, received ${actual.blocks.length}.`);
    }
    actual.blocks.forEach((block, index) => {
        const expectedBlock = expected.blocks[index];
        if (block.type !== expectedBlock.type) {
            throw new Error(`Unexpected ${scope} block type at position ${index + 1}.`);
        }
        if (block.type === 'heading' && expectedBlock.type === 'heading') {
            if (block.level !== expectedBlock.level || block.id !== expectedBlock.id) {
                throw new Error(`Unexpected ${scope} heading structure at position ${index + 1}.`);
            }
        }
        if (block.type === 'list' && expectedBlock.type === 'list') {
            if (block.ordered !== expectedBlock.ordered || block.items.length !== expectedBlock.items.length) {
                throw new Error(`Unexpected ${scope} list structure at position ${index + 1}.`);
            }
        }
    });

    const actualNumbers = actual.notes.map((note) => note.number);
    const expectedNumbers = expected.notes.map((note) => note.number);
    if (JSON.stringify(actualNumbers) !== JSON.stringify(expectedNumbers)) {
        throw new Error(`Unexpected ${scope} endnote numbers.`);
    }
}

export function portableTextToEditorialStory(
    blocks: unknown,
    endnotes: unknown,
    expected: EditorialStory,
    scope: string,
): EditorialStory {
    if (!Array.isArray(blocks)) throw new Error(`Missing ${scope} formatted text.`);
    if (!Array.isArray(endnotes)) throw new Error(`Missing ${scope} endnotes.`);

    const result: EditorialBlock[] = [];
    for (const [index, value] of blocks.entries()) {
        const block = value as PortableTextBlock;
        if (block?._type !== 'block' || typeof block._key !== 'string') {
            throw new Error(`Editorial block ${scope}.${index + 1} is invalid.`);
        }
        const html = inlineHtml(block, `${scope}.${block._key}`);
        if (block.listItem) {
            if (!['bullet', 'number'].includes(block.listItem) || (block.level ?? 1) !== 1) {
                throw new Error(`Editorial list item ${scope}.${block._key} is not supported.`);
            }
            const ordered = block.listItem === 'number';
            const previous = result.at(-1);
            if (previous?.type === 'list' && previous.ordered === ordered) previous.items.push(html);
            else result.push({type: 'list', ordered, items: [html]});
            continue;
        }
        if (block.style === 'h2' || block.style === 'h3') {
            result.push({type: 'heading', level: block.style === 'h2' ? 2 : 3, id: block._key, html});
            continue;
        }
        if ((block.style ?? 'normal') !== 'normal') {
            throw new Error(`Editorial block style ${block.style} is not supported at ${scope}.${block._key}.`);
        }
        result.push({type: 'paragraph', html});
    }

    const notes = endnotes.map((value, index) => {
        const note = value as PortableTextEndnote;
        if (typeof note?.noteId !== 'string' || !Number.isInteger(note.number)) {
            throw new Error(`Editorial endnote ${scope}.${index + 1} is invalid.`);
        }
        const expectedId = `${scope}-note-${note.number}`;
        if (note.noteId !== expectedId || !Array.isArray(note.body) || note.body.length !== 1) {
            throw new Error(`Editorial endnote ${scope}.${note.number} has an unexpected structure.`);
        }
        const body = note.body[0];
        if (body?._type !== 'block' || (body.style ?? 'normal') !== 'normal' || body.listItem) {
            throw new Error(`Editorial endnote ${scope}.${note.number} must contain one paragraph.`);
        }
        return {number: note.number, html: inlineHtml(body, `${scope}.note.${note.number}`)};
    });

    const story = {blocks: result, notes};
    validateStructure(story, expected, scope);
    return story;
}
