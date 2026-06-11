import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'assets', 'images');

const IMAGES = [
  {
    id: 'hero-main',
    dir: 'hero',
    local: join(OUT, 'hero', 'hero-main.png'),
    widths: [480, 768, 960, 1140],
    preserveAlpha: true,
    trimAlpha: true,
  },
  {
    id: 'about-team',
    dir: 'about',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=2000&q=90',
    aspect: 4 / 5,
    widths: [400, 600, 800],
  },
  {
    id: 'case-retail',
    dir: 'cases',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&h=1080&q=90',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
  },
  {
    id: 'case-banking',
    dir: 'cases',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&h=1080&q=90',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
  },
  {
    id: 'case-wellness',
    dir: 'cases',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1920&h=1080&q=90',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
  },
  {
    id: 'case-b2b',
    dir: 'cases',
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&h=1080&q=90',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
  },
  {
    id: 'portfolio-marketing',
    dir: 'portfolio',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=1200&q=90',
    aspect: 1,
    widths: [400, 600, 800],
  },
  {
    id: 'portfolio-healthcare',
    dir: 'portfolio',
    url: 'https://plus.unsplash.com/premium_photo-1681842917626-e3456c461514?auto=format&fit=crop&w=1200&h=1200&q=90',
    aspect: 1,
    widths: [400, 600, 800],
  },
  {
    id: 'blog-ai-design',
    dir: 'blog',
    url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1920&h=960&q=90',
    aspect: 2,
    widths: [400, 600, 800, 1200],
  },
  {
    id: 'blog-cookies',
    dir: 'blog',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&h=960&q=90',
    aspect: 2,
    widths: [400, 600, 800, 1200],
  },
  {
    id: 'blog-saas-strategy',
    dir: 'blog',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&h=960&q=90',
    aspect: 2,
    widths: [400, 600, 800, 1200],
  },
];

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateVariant(buffer, width, aspect, options = {}) {
  const height = Math.round(width / aspect);
  const pipeline = sharp(buffer).resize(width, height, options.preserveAlpha
    ? { fit: 'inside', withoutEnlargement: true }
    : { fit: 'cover', position: 'centre' });
  return pipeline
    .webp({ quality: options.preserveAlpha ? 85 : 82, effort: 4, alphaQuality: 90 })
    .toBuffer();
}

async function processImage(def) {
  const dir = join(OUT, def.dir);
  await mkdir(dir, { recursive: true });

  let source;
  let aspect = def.aspect;

  if (def.local) {
    console.log(`Processing local ${def.id}...`);
    source = await readFile(def.local);
    if (def.trimAlpha) {
      source = await sharp(source).trim().toBuffer();
    }
    const meta = await sharp(source).metadata();
    aspect = meta.width / meta.height;
  } else {
    console.log(`Downloading ${def.id}...`);
    source = await download(def.url);
  }

  const manifest = { id: def.id, dir: def.dir, aspect, widths: [] };

  for (const width of def.widths) {
    const filename = `${def.id}-${width}.webp`;
    const outPath = join(dir, filename);
    const webp = await generateVariant(source, width, aspect, def);
    await writeFile(outPath, webp);
    manifest.widths.push({ width, file: `assets/images/${def.dir}/${filename}` });
    console.log(`  wrote ${filename} (${(webp.length / 1024).toFixed(1)} KB)`);
  }

  return manifest;
}

const manifests = [];
for (const def of IMAGES) {
  manifests.push(await processImage(def));
}

await writeFile(
  join(OUT, 'manifest.json'),
  JSON.stringify(manifests, null, 2)
);
console.log('Done. Manifest written to assets/images/manifest.json');
