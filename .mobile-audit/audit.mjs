import { chromium, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] ?? 'before';
const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const ROUTES = [
  ['/', 'home'],
  ['/lived-experiences', 'lived-experiences'],
  ['/bibliography', 'bibliography'],
  ['/resources', 'resources'],
  ['/supply', 'supply'],
  ['/health-outcomes', 'health-outcomes']
];

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'iphone-14-pro', width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
];

const dir = join(process.cwd(), '.mobile-audit', OUT);
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    });
    const page = await ctx.newPage();
    const overflows = [];
    for (const [path, slug] of ROUTES) {
      const url = BASE + path;
      console.log(`[${vp.name}] ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      } catch (e) {
        console.warn(`  goto failed (continuing): ${e.message}`);
      }
      // Let charts/maps render
      await page.waitForTimeout(2500);
      // Detect horizontal overflow
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const offenders = [];
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > docW + 1 || r.left < -1) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.getAttribute('class') || '').slice(0, 80);
            offenders.push({ tag, cls, left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
          }
        });
        return { docW, scrollW: document.documentElement.scrollWidth, offenders: offenders.slice(0, 12) };
      });
      overflows.push({ route: path, vp: vp.name, ...overflow });
      await page.screenshot({
        path: join(dir, `${vp.name}__${slug}.png`),
        fullPage: true
      });
    }
    console.log(JSON.stringify(overflows, null, 2));
    await ctx.close();
  }
} finally {
  await browser.close();
}
