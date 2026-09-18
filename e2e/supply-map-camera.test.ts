import {expect, test} from '@playwright/test';

test.use({launchOptions: {args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']}});

for (const width of [1280, 390]) {
    test(`supply map starts at its zoom-out limit (${width}px)`, async ({page}) => {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/supply?lang=en`);
        const map = page.locator('.supply-map');
        const zoomOut = map.locator('.maplibregl-ctrl-zoom-out');
        const zoomIn = map.locator('.maplibregl-ctrl-zoom-in');
        await expect(zoomOut).toBeDisabled();
        await zoomIn.click();
        await expect(zoomOut).toBeEnabled();
        await zoomOut.click();
        await expect(zoomOut).toBeDisabled();
        await map.getByRole('button', {name: 'Overseas', exact: true}).click();
        await expect(zoomOut).toBeEnabled();
        await map.getByRole('button', {name: 'Return to the territory overview'}).click();
        await expect(zoomOut).toBeDisabled();
        await page.setViewportSize({width: width === 1280 ? 390 : 1280, height: 900});
        await expect(zoomOut).toBeDisabled();
    });
}
