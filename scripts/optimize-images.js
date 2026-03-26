import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'fs/promises';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'static/images');
const OUT_DIR = join(ROOT, 'static/images/optimized');
const MANIFEST = join(ROOT, 'src/lib/data/gallery-manifest.json');

const THUMB_WIDTH = 400;
const THUMB_QUALITY = 80;
const FULL_WIDTH = 1600;
const FULL_QUALITY = 85;

async function main() {
	await mkdir(OUT_DIR, { recursive: true });

	const files = (await readdir(SRC_DIR)).filter((f) =>
		/\.(jpe?g|png|webp)$/i.test(f)
	);

	console.log(`Found ${files.length} images to optimize`);

	const manifest = [];

	for (const file of files) {
		const { name } = parse(file);
		const src = join(SRC_DIR, file);

		const thumbPath = `${name}-thumb.webp`;
		const fullPath = `${name}-full.webp`;

		await sharp(src)
			.resize({ width: THUMB_WIDTH })
			.webp({ quality: THUMB_QUALITY })
			.toFile(join(OUT_DIR, thumbPath));

		await sharp(src)
			.resize({ width: FULL_WIDTH, withoutEnlargement: true })
			.webp({ quality: FULL_QUALITY })
			.toFile(join(OUT_DIR, fullPath));

		manifest.push({
			id: name,
			thumb: `/images/optimized/${thumbPath}`,
			full: `/images/optimized/${fullPath}`,
			caption: ''
		});

		console.log(`  ✓ ${file}`);
	}

	await writeFile(MANIFEST, JSON.stringify(manifest, null, '\t') + '\n');
	console.log(`\nDone. ${manifest.length} images optimized → ${OUT_DIR}`);
	console.log(`Manifest written → ${MANIFEST}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
