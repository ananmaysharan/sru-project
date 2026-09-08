import {expect, test} from '@playwright/test';

const expected = {
    en: {
        title: 'A call for more post‑occupancy evaluations',
        residentTitle: 'Residents assess the housing projects',
        firstTopic: 'Residential pride and the symbolic value of place',
        lastTopic: 'Governance, coordination and the “after” of flagship projects',
        firstQuote: '“We all felt like we’d won the lottery when we were allocated housing in this neighborhood.”',
        firstCaption: 'The Samaritaine block on Place de l’École, where the redevelopment combines luxury retail with new social housing in the historic heart of Paris.',
        lastCaptionStart: 'The axonometric view presents Cœur de Ville',
    },
    fr: {
        title: 'Appel à développer plus d’évaluations de l’usage des bâtiments de logements sociaux',
        residentTitle: 'Les habitants évaluent les projets de logements',
        firstTopic: 'Fierté d’habiter et valeur symbolique du lieu',
        lastTopic: 'Gouvernance, coordination et devenir des projets emblématiques',
        firstQuote: '“On a tous eu l’impression qu’on gagnait au Loto en ayant une attribution de logement dans ce quartier.”',
        firstCaption: 'L’îlot de la Samaritaine, place de l’École, où le projet de réaménagement associe commerces de luxe et nouveaux logements sociaux dans le centre historique de Paris.',
        lastCaptionStart: 'La vue axonométrique présente Cœur de Ville',
    },
};

for (const language of ['en', 'fr'] as const) {
    test(`Post-Occupancy keeps its fixed bilingual content relationships (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/post-occupancy-evaluation?lang=${language}`);
        const content = expected[language];
        const pageShell = page.locator('#socio-econometrics');

        await expect(page.locator('html')).toHaveAttribute('lang', language, {timeout: 20_000});
        await expect(pageShell.getByRole('heading', {level: 1})).toHaveText(content.title);
        await expect(pageShell.locator('.prose-column > .page-intro-body')).toHaveCount(3);

        const captions = pageShell.locator('.story-caption');
        await expect(captions).toHaveCount(44);
        await expect(captions.first()).toHaveText(content.firstCaption);
        await expect(captions.last()).toContainText(content.lastCaptionStart);

        await expect(pageShell.locator('#resident-voices-title')).toHaveText(content.residentTitle);
        const topics = pageShell.locator('.resident-topic-button > span:first-child');
        await expect(topics).toHaveCount(6);
        await expect(topics.first()).toHaveText(content.firstTopic);
        await expect(topics.last()).toHaveText(content.lastTopic);
        await expect(pageShell.locator('.resident-quote')).toHaveCount(19);
        await expect(pageShell.locator('.resident-quote').first()).toHaveText(content.firstQuote);

        const conclusion = page.locator('#editorial-post-occupancy');
        await expect(conclusion.locator('.editorial-noteref')).toHaveCount(9);
        await expect(conclusion.locator('.editorial-notes li')).toHaveCount(9);
        await expect(conclusion.locator('#editorial-post-occupancy-noteref-12')).toHaveAttribute(
            'href',
            '#editorial-post-occupancy-note-12',
        );
        await expect(conclusion.locator('#editorial-post-occupancy-noteref-20')).toHaveAttribute(
            'href',
            '#editorial-post-occupancy-note-20',
        );
    });
}
