import {readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

import {expect, test} from '@playwright/test';

type BoundaryCollection = {
    type: 'FeatureCollection';
    features: Array<{properties?: {code?: string}}>;
};

const projectRoot = resolve(import.meta.dirname, '..');
const cloudflarePagesFileLimit = 25 * 1024 * 1024;

function readBoundaryFile(filename: string) {
    const path = resolve(projectRoot, 'static', filename);
    expect(statSync(path).size, `${filename} must remain below Cloudflare Pages' 25 MiB limit`).toBeLessThan(
        cloudflarePagesFileLimit,
    );
    return JSON.parse(readFileSync(path, 'utf8')) as BoundaryCollection;
}

test('local map fallbacks are complete, scoped, and deployable', () => {
    const communes = readBoundaryFile('communes_2022_sru.geojson');
    const departments = readBoundaryFile('departments_2022_outre_mer_100m.geojson');
    const sruCommunes = JSON.parse(
        readFileSync(resolve(projectRoot, 'src/lib/data/map/sru-communes.json'), 'utf8'),
    ) as Record<string, unknown>;
    const sruDepartments = JSON.parse(
        readFileSync(resolve(projectRoot, 'src/lib/data/map/sru-departements.json'), 'utf8'),
    ) as Record<string, unknown>;

    expect(communes.type).toBe('FeatureCollection');
    expect(departments.type).toBe('FeatureCollection');
    expect(communes.features).toHaveLength(2180);
    expect(departments.features.length).toBeGreaterThanOrEqual(100);

    const communeCodes = communes.features.map((feature) => String(feature.properties?.code));
    const departmentCodes = new Set(
        departments.features.map((feature) => String(feature.properties?.code)),
    );

    expect(new Set(communeCodes).size).toBe(communeCodes.length);
    expect(communeCodes.every((code) => Object.hasOwn(sruCommunes, code))).toBe(true);
    expect(Object.keys(sruDepartments).every((code) => departmentCodes.has(code))).toBe(true);
});
