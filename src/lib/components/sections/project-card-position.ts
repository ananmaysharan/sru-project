export type ProjectCardAnchor = {
    x: number;
    y: number;
};

/** Place the full card beside the pointer, flipping at the viewport edges. */
export function positionProjectCard(
    anchor: ProjectCardAnchor,
    viewport: { width: number; height: number },
    card: { width: number; height: number },
) {
    const inset = 12;
    const gap = 12;
    const maxLeft = Math.max(inset, viewport.width - card.width - inset);
    const preferredLeft = anchor.x + gap + card.width <= viewport.width - inset
        ? anchor.x + gap
        : anchor.x - card.width - gap;
    const left = Math.max(inset, Math.min(preferredLeft, maxLeft));
    const top = anchor.y + gap;

    return {
        left,
        top: Math.max(inset, Math.min(top, viewport.height - card.height - inset)),
    };
}
