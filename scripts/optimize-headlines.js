import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'static/headlines');
const OUT_DIR = join(ROOT, 'static/headlines/optimized');

const THUMB_WIDTH = 600;
const THUMB_QUALITY = 82;
const FULL_WIDTH = 1800;
const FULL_QUALITY = 88;

async function main() {
	await mkdir(OUT_DIR, { recursive: true });

	const files = (await readdir(SRC_DIR)).filter((f) =>
		/\.(jpe?g|png|webp)$/i.test(f)
	);

	console.log(`Found ${files.length} headlines to optimize`);

	for (const file of files) {
		const { name } = parse(file);
		const src = join(SRC_DIR, file);

		const thumbPath = `${name}-thumb.webp`;
		const fullPath = `${name}-full.webp`;

		await sharp(src)
			.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
			.webp({ quality: THUMB_QUALITY })
			.toFile(join(OUT_DIR, thumbPath));

		await sharp(src)
			.resize({ width: FULL_WIDTH, withoutEnlargement: true })
			.webp({ quality: FULL_QUALITY })
			.toFile(join(OUT_DIR, fullPath));

		console.log(`  ✓ ${file}`);
	}

	console.log(`\nDone. ${files.length} headlines optimized → ${OUT_DIR}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
