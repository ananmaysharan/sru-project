import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {parseFragment} from 'parse5';

type HtmlNode = {
    nodeName: string;
    tagName?: string;
    value?: string;
    attrs?: {name: string; value: string}[];
    childNodes?: HtmlNode[];
};

type Segment = {
    text: string;
    href?: string;
    italic?: boolean;
    bold?: boolean;
};

function attribute(node: HtmlNode, name: string) {
    return node.attrs?.find((item) => item.name === name)?.value;
}

function descendants(node: HtmlNode, tagName: string): HtmlNode[] {
    const matches: HtmlNode[] = [];
    for (const child of node.childNodes ?? []) {
        if (child.tagName === tagName) matches.push(child);
        matches.push(...descendants(child, tagName));
    }
    return matches;
}

function textContent(node: HtmlNode): string {
    if (node.nodeName === '#text') return node.value ?? '';
    return (node.childNodes ?? []).map(textContent).join('');
}

function segmentsFor(node: HtmlNode, inherited: Omit<Segment, 'text'> = {}): Segment[] {
    if (node.nodeName === '#text') {
        return node.value ? [{text: node.value, ...inherited}] : [];
    }

    const marks: Omit<Segment, 'text'> = {...inherited};
    if (node.tagName === 'em') marks.italic = true;
    if (node.tagName === 'strong') marks.bold = true;
    if (node.tagName === 'a') {
        const href = attribute(node, 'href');
        if (href) marks.href = href;
    }

    return (node.childNodes ?? []).flatMap((child) => segmentsFor(child, marks));
}

const sourcePath = resolve('src/routes/bibliography/+page.svelte');
const outputPath = resolve('src/lib/data/bibliography-en.generated.json');
const source = await readFile(sourcePath, 'utf8');
const start = source.indexOf('<!-- Peer-reviewed papers -->');
const end = source.indexOf('{/if}', start);
if (start === -1 || end === -1) throw new Error('Could not find the English bibliography markup.');

const fragment = parseFragment(source.slice(start, end)) as unknown as HtmlNode;
const sections = descendants(fragment, 'section')
    .filter((section) => (attribute(section, 'class') ?? '').split(/\s+/).includes('index-group'))
    .map((section) => {
        const heading = descendants(section, 'h2')[0];
        const list = descendants(section, 'ul')[0];
        if (!heading || !list) throw new Error('An English bibliography section is missing its heading or list.');
        const items = (list.childNodes ?? [])
            .filter((node) => node.tagName === 'li')
            .map((item) => ({segments: segmentsFor(item)}));
        return {title: textContent(heading), items};
    });

if (sections.length !== 7) throw new Error(`Expected 7 English bibliography sections, received ${sections.length}.`);
await writeFile(outputPath, `${JSON.stringify(sections, null, 2)}\n`, 'utf8');
console.log(`Extracted ${sections.length} English bibliography sections to ${outputPath}`);
