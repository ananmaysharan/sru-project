export type ProjectCardAnchor = {
    x: number;
    y: number;
    bandTop: number;
    bandBottom: number;
};

/** Keep the floating card in view and out of the project row's hit area. */
export function positionProjectCard(
    anchor: ProjectCardAnchor,
    viewport: { width: number; height: number },
    card: { width: number; height: number },
) {
    const inset = 12;
    const gap = 12;
    const above = Math.max(0, anchor.bandTop - gap - inset);
    const below = Math.max(0, viewport.height - anchor.bandBottom - gap - inset);
    // Choose by available space, not the already-constrained card height.
    // Otherwise resizing the card can repeatedly flip it between both sides.
    const placeBelow = below >= above;
    const maxHeight = Math.max(1, Math.min(608, placeBelow ? below : above));
    const height = Math.min(card.height, maxHeight);
    const maxLeft = Math.max(inset, viewport.width - card.width - inset);
    const preferredLeft = anchor.x + gap + card.width <= viewport.width - inset
        ? anchor.x + gap
        : anchor.x - card.width - gap;
    const left = Math.max(inset, Math.min(preferredLeft, maxLeft));
    const top = placeBelow
        ? Math.max(anchor.y + gap, anchor.bandBottom + gap)
        : Math.min(anchor.y - height - gap, anchor.bandTop - height - gap);

    return {
        left,
        top: Math.max(inset, Math.min(top, viewport.height - height - inset)),
        maxHeight,
    };
}
