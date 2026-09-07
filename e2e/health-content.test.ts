import {expect, test} from '@playwright/test';

const expected = {
    en: {
        title: 'Health Outcomes',
        sectionTitles: [
            'Where did social housing grow since the early 2000s—amenity-rich vs. amenity-poor areas?',
            'Social housing growth and health outcomes',
            'Explanation of key health outcomes',
        ],
        firstMetric: 'Change in social housing share',
        lastMetric: 'Proximity to healthcare and hospital infrastructure',
    },
    fr: {
        title: 'Indicateurs de santé',
        sectionTitles: [
            'Où le logement social s’est-il développé depuis le début des années 2000 : dans les territoires bien équipés ou sous-équipés ?',
            'Croissance du logement social et indicateurs de santé',
            'Interprétation des principaux indicateurs de santé',
        ],
        firstMetric: 'Évolution de la part de logements sociaux',
        lastMetric: 'Proximité des services de santé et des établissements hospitaliers',
    },
};

for (const language of ['en', 'fr'] as const) {
    test(`Health Outcomes keeps its fixed content structure and endnote (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/health-outcomes?lang=${language}`);
        const health = page.locator('#demographics');

        await expect(health.getByRole('heading', {level: 1})).toHaveText(expected[language].title);
        expect(await health.locator('.section-title').allTextContents()).toEqual(expected[language].sectionTitles);
        await expect(health.locator('#health-metric-definitions dt')).toHaveCount(9);
        await expect(health.locator('#health-metric-definitions dt').first()).toHaveText(expected[language].firstMetric);
        await expect(health.locator('#health-metric-definitions dt').last()).toHaveText(expected[language].lastMetric);
        await expect(health.locator('.editorial-noteref')).toHaveCount(1);
        await expect(health.locator('.editorial-notes li')).toHaveCount(1);
        await expect(health.locator('#editorial-health-method-noteref-11')).toHaveAttribute(
            'href',
            '#editorial-health-method-note-11',
        );
    });
}
