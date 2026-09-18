import {expect, test} from '@playwright/test';

test.use({launchOptions: {args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']}});

for (const width of [1280, 390]) {
    test(`both health maps use the starting zoom as their limit (${width}px)`, async ({page}) => {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/health-outcomes?lang=en`);
        const maps = page.locator('.health-map');
        await expect(maps).toHaveCount(2);
        for (const map of await maps.all()) {
            const zoomOut = map.locator('.maplibregl-ctrl-zoom-out');
            await expect(zoomOut).toBeDisabled();
            await map.locator('.maplibregl-ctrl-zoom-in').click();
            await expect(zoomOut).toBeEnabled();
            await zoomOut.click();
            await expect(zoomOut).toBeDisabled();
            await map.getByRole('button', {name: 'Overseas', exact: true}).click();
            await expect(zoomOut).toBeEnabled();
            await map.getByRole('button', {name: 'Return to the territory overview'}).click();
            await expect(zoomOut).toBeDisabled();
        }
        await page.setViewportSize({width: width === 1280 ? 390 : 1280, height: 900});
        for (const map of await maps.all()) {
            await expect(map.locator('.maplibregl-ctrl-zoom-out')).toBeDisabled();
        }
    });
}
