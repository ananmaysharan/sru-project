import {expect, test} from '@playwright/test';

const expected = {
    en: {
        title: 'The Loi SRU French social housing program, 25 years later',
        supporters: 'Supported by',
        housingTitle: '25 years of fair-share housing provision',
        newsTitle: 'In the news',
        acknowledgements: 'Acknowledgements',
        acknowledgementGroups: [
            'Data Access',
            'Conversations that Informed this Project',
            'Photography',
            'Research Assistantship Team',
        ],
    },
    fr: {
        title: 'La Loi SRU : bilan après 25 ans',
        supporters: 'Avec le soutien de',
        housingTitle: '25 ans de rééquilibrage de l’offre de logements sociaux',
        newsTitle: 'À la une',
        acknowledgements: 'Remerciements',
        acknowledgementGroups: [
            'Accès aux données',
            'Échanges et contributions à la réflexion',
            'Photographies',
            'Équipe d’assistants de recherche',
        ],
    },
};

const heroLinks = [
    'https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790',
    'https://sig.ville.gouv.fr/',
    'https://www.onpv.fr/donnees',
    'https://www.insee.fr/fr/statistiques/2500477',
];

for (const language of ['en', 'fr'] as const) {
    test(`Introduction keeps its fixed content structure, links, and endnotes (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/?lang=${language}`);
        const content = expected[language];
        const hero = page.locator('.intro-hero');

        await expect(page.locator('html')).toHaveAttribute('lang', language, {timeout: 20_000});
        await expect(hero.getByRole('heading', {level: 1})).toHaveText(content.title);
        await expect(hero.locator('.max-w-2xl > p')).toHaveCount(6);
        await expect(hero.locator('.max-w-2xl a')).toHaveCount(4);
        expect(await hero.locator('.max-w-2xl a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
            .toEqual(heroLinks);

        await expect(page.locator('.support-section h2')).toHaveText(content.supporters);
        await expect(page.locator('.story-copy-primary h2')).toHaveText(content.housingTitle);
        await expect(page.locator('.story-copy-secondary h2')).toHaveText(content.newsTitle);

        const acknowledgements = page.locator('.acknowledgements');
        await expect(acknowledgements.getByRole('heading', {level: 2})).toHaveText(content.acknowledgements);
        expect(await acknowledgements.getByRole('heading', {level: 3}).allTextContents())
            .toEqual(content.acknowledgementGroups);
        await expect(page.locator('#editorial-introduction .editorial-noteref')).toHaveCount(8);
        await expect(page.locator('#editorial-introduction-notes .editorial-notes li')).toHaveCount(8);
        await expect(page.locator('#editorial-introduction-noteref-1')).toHaveAttribute(
            'href',
            '#editorial-introduction-note-1',
        );
        await expect(page.locator('#editorial-introduction-noteref-8')).toHaveAttribute(
            'href',
            '#editorial-introduction-note-8',
        );
    });
}
