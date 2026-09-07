import {expect, test} from '@playwright/test';

const expectations = {
    en: {
        title: 'The Loi SRU French social housing program, 25 years later',
        skipLink: 'Skip to main content',
        navigation: [
            'Introduction',
            'The Numbers',
            'Health Outcomes',
            'Post-Occupancy Evaluation',
            'News Sources',
            'Bibliography',
        ],
        pageNavigation: ['Previous page\nPost-Occupancy Evaluation', 'Next page\nBibliography'],
        lexiconButton: 'Lexicon',
        lexiconHeading: 'Dashboard lexicon',
        lexiconTerm: 'Social rental housing stock:',
    },
    fr: {
        title: 'La Loi SRU : bilan après 25 ans',
        skipLink: 'Aller au contenu principal',
        navigation: [
            'Introduction',
            'Chiffres',
            'Indicateurs de santé',
            'Évaluation de l’usage des bâtiments',
            'Revue de presse',
            'Bibliographie',
        ],
        pageNavigation: [
            'Page précédente\nÉvaluation de l’usage des bâtiments',
            'Page suivante\nBibliographie',
        ],
        lexiconButton: 'Lexique',
        lexiconHeading: 'Lexique du tableau de bord',
        lexiconTerm: 'Parc locatif social :',
    },
};

for (const language of ['en', 'fr'] as const) {
    test(`shared site text is complete and editable through site settings (${language})`, async ({page}) => {
        const expected = expectations[language];
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/resources?lang=${language}`);

        await expect(page).toHaveTitle(expected.title);
        await expect(page.locator('.skip-link')).toHaveText(expected.skipLink);
        expect(await page.locator('nav').first().locator('ul').first().locator('a').allTextContents()).toEqual(
            expected.navigation,
        );

        const pageNavigation = page.getByRole('navigation', {
            name: language === 'fr' ? 'Navigation entre les pages' : 'Page navigation',
        });
        expect(await pageNavigation.locator('a').allInnerTexts()).toEqual(expected.pageNavigation);

        await page.getByRole('button', {name: expected.lexiconButton, exact: true}).click();
        const lexicon = page.locator('#dashboard-lexicon-panel');
        await expect(lexicon.getByRole('heading', {level: 2})).toHaveText(expected.lexiconHeading);
        await expect(lexicon.locator('strong').first()).toHaveText(expected.lexiconTerm);
    });
}
