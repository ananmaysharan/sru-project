export type EditorialSectionKey =
    | "introduction"
    | "supply"
    | "health-method"
    | "health-chart"
    | "post-occupancy";

type EditorialBlock =
    | { type: "heading"; level: 2 | 3; id: string; html: string }
    | { type: "paragraph"; html: string }
    | { type: "list"; ordered: boolean; items: string[] };

type EditorialNote = { number: number; html: string };

export type EditorialStory = {
    blocks: EditorialBlock[];
    notes: EditorialNote[];
};

const markerToKey = (line: string): EditorialSectionKey | null => {
    if (!line.includes("THIS TEXT PORTION BELOW GOES IN")) return null;
    if (line.includes("INTRODUCTION PAGE")) return "introduction";
    if (line.includes("NYMBERS PAGE")) return "supply";
    if (line.includes("POST-OCCUPANCY EVALUATION PAGE")) return "post-occupancy";
    if (line.includes("HEALTH OUTCOMES PAGE") && line.includes("before the quadrant")) {
        return "health-chart";
    }
    if (line.includes("HEALTH OUTCOMES PAGE")) return "health-method";
    return null;
};

const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

const slugify = (value: string) =>
    value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const renderInline = (value: string, scope: string, linkNotes = true) => {
    let html = escapeHtml(value.replaceAll("\\[", "[").replaceAll("\\]", "]"));
    html = html.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    if (linkNotes) {
        html = html.replace(/\[(\d+)\]/g, (_match, number: string) => {
            const id = `${scope}-note-${number}`;
            return `<sup class="editorial-noteref" role="doc-noteref"><a id="${scope}-noteref-${number}" href="#${id}" aria-label="Footnote ${number}">${number}</a></sup>`;
        });
    }
    return html;
};

const unwrapHeading = (line: string) =>
    line
        .replace(/^\*\*<u>/, "")
        .replace(/<\/u>\*\*$/, "")
        .replace(/^\*\*\*/, "")
        .replace(/\*\*\*:?$/, "")
        .replace(/^\*\*/, "")
        .replace(/\*\*$/, "");

export function parseEditorialStory(
    source: string,
    section: EditorialSectionKey,
): EditorialStory {
    const lines = source.replaceAll("\r\n", "\n").split("\n");
    const noteStart = lines.findIndex((line) => /^\[\d+\]\s/.test(line));
    const contentLines = noteStart === -1 ? lines : lines.slice(0, noteStart);
    const noteLines = noteStart === -1 ? [] : lines.slice(noteStart);
    const sections = new Map<EditorialSectionKey, string[]>();
    let active: EditorialSectionKey | null = null;

    for (const line of contentLines) {
        const marker = markerToKey(line);
        if (marker) {
            active = marker;
            sections.set(marker, []);
            continue;
        }
        if (active) sections.get(active)?.push(line);
    }

    const scope = `editorial-${section}`;
    const selected = sections.get(section) ?? [];
    const blocks: EditorialBlock[] = [];
    let index = 0;

    while (index < selected.length) {
        const line = selected[index].trim();
        if (!line) {
            index += 1;
            continue;
        }

        if (/^\*\*<u>.*<\/u>\*\*$/.test(line) || /^\*\*[^*].*\*\*$/.test(line)) {
            const text = unwrapHeading(line);
            blocks.push({
                type: "heading",
                level: 2,
                id: `${scope}-${slugify(text)}`,
                html: renderInline(text, scope),
            });
            index += 1;
            continue;
        }

        if (/^\*\*\*.*\*\*\*:?$/.test(line)) {
            const text = unwrapHeading(line);
            blocks.push({
                type: "heading",
                level: 3,
                id: `${scope}-${slugify(text)}`,
                html: renderInline(text, scope),
            });
            index += 1;
            continue;
        }

        const unordered = /^-\s+/.test(line);
        const ordered = /^\d+\.\s+/.test(line);
        if (unordered || ordered) {
            const items: string[] = [];
            while (index < selected.length) {
                const candidate = selected[index].trim();
                if (!candidate) {
                    index += 1;
                    continue;
                }
                const pattern = ordered ? /^\d+\.\s+/ : /^-\s+/;
                if (!pattern.test(candidate)) break;
                items.push(renderInline(candidate.replace(pattern, ""), scope));
                index += 1;
            }
            blocks.push({ type: "list", ordered, items });
            continue;
        }

        blocks.push({ type: "paragraph", html: renderInline(line, scope) });
        index += 1;
    }

    const referenced = new Set<number>();
    for (const line of selected) {
        for (const match of line.matchAll(/\[(\d+)\]/g)) {
            referenced.add(Number(match[1]));
        }
    }

    const notes = noteLines
        .map((line) => line.match(/^\[(\d+)\]\s+(.*)$/))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .map((match) => ({
            number: Number(match[1]),
            html: renderInline(match[2], scope, false),
        }))
        .filter((note) => referenced.has(note.number));

    return { blocks, notes };
}
