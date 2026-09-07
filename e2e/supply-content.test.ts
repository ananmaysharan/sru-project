import {expect, test} from '@playwright/test';

const expected = {
    en: {
        title: 'The Numbers',
        visualTitles: [
            'Evolution of national French social housing stock (1920–2022)',
            'France: Main Type of Residences Occupied (1984–2023)',
            'Social Housing Unit Distribution (2022)',
            'Social Housing Units per 10,000 Inhabitants (2023)',
        ],
        sectionTitles: [
            'Regional Breakdown',
            'Supply Map',
            'Non-Compliance (2005–2022)',
            'Overseas Territories',
            'European Context',
        ],
    },
    fr: {
        title: 'Chiffres',
        visualTitles: [
            'Évolution du parc national français de logements sociaux (1920–2022)',
            'France : principaux statuts d’occupation des résidences principales (1984–2023)',
            'Répartition des logements sociaux (2022)',
            'Logements sociaux pour 10 000 habitants (2023)',
        ],
        sectionTitles: [
            'Répartition régionale',
            'Carte de l’offre',
            'Non-respect des obligations (2005–2022)',
            'Territoires ultramarins',
            'Contexte européen',
        ],
    },
};

for (const language of ['en', 'fr'] as const) {
    test(`Supply page keeps its fixed content structure and endnotes (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/supply?lang=${language}`);
        const supply = page.locator('#supply');

        await expect(page.locator('html')).toHaveAttribute('lang', language, {timeout: 20_000});
        await expect(supply.getByRole('heading', {level: 1})).toHaveText(expected[language].title);
        expect(await supply.locator('.visual-title').allTextContents()).toEqual(expected[language].visualTitles);
        expect(await supply.locator('.section-title').allTextContents()).toEqual(expected[language].sectionTitles);
        await expect(supply.locator('.editorial-noteref')).toHaveCount(2);
        await expect(supply.locator('.editorial-notes li')).toHaveCount(2);
        await expect(supply.locator('#editorial-supply-noteref-9')).toHaveAttribute(
            'href',
            '#editorial-supply-note-9',
        );
        await expect(supply.locator('#editorial-supply-noteref-10')).toHaveAttribute(
            'href',
            '#editorial-supply-note-10',
        );
    });
}
