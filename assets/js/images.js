const IMAGE_MANIFEST = {
  'hero-main': {
    dir: 'hero',
    aspect: 756 / 660,
    widths: [480, 768, 960, 1140],
    defaultWidth: 960,
  },
  'about-team': {
    dir: 'about',
    aspect: 4 / 5,
    widths: [400, 600, 800],
    defaultWidth: 800,
  },
  'case-retail': {
    dir: 'cases',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
    defaultWidth: 900,
  },
  'case-banking': {
    dir: 'cases',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
    defaultWidth: 900,
  },
  'case-wellness': {
    dir: 'cases',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
    defaultWidth: 900,
  },
  'case-b2b': {
    dir: 'cases',
    aspect: 16 / 9,
    widths: [480, 720, 900, 1200],
    defaultWidth: 900,
  },
  'portfolio-marketing': {
    dir: 'portfolio',
    aspect: 1,
    widths: [400, 600, 800],
    defaultWidth: 800,
  },
  'portfolio-healthcare': {
    dir: 'portfolio',
    aspect: 1,
    widths: [400, 600, 800],
    defaultWidth: 800,
  },
  'blog-ai-design': {
    dir: 'blog',
    aspect: 2,
    widths: [400, 600, 800, 1200],
    defaultWidth: 1200,
  },
  'blog-cookies': {
    dir: 'blog',
    aspect: 2,
    widths: [400, 600, 800, 1200],
    defaultWidth: 1200,
  },
  'blog-saas-strategy': {
    dir: 'blog',
    aspect: 2,
    widths: [400, 600, 800, 1200],
    defaultWidth: 1200,
  },
};

function imagePath(id, width) {
  const meta = IMAGE_MANIFEST[id];
  if (!meta) return '';
  return 'assets/images/' + meta.dir + '/' + id + '-' + width + '.webp';
}

function imageSrcset(id, widths) {
  const meta = IMAGE_MANIFEST[id];
  const list = widths || meta.widths;
  return list
    .map(function (w) { return imagePath(id, w) + ' ' + w + 'w'; })
    .join(', ');
}

function imageDimensions(id, width) {
  const meta = IMAGE_MANIFEST[id];
  const w = width || meta.defaultWidth;
  return { width: w, height: Math.round(w / meta.aspect) };
}

function responsiveImg(id, alt, options) {
  options = options || {};
  const meta = IMAGE_MANIFEST[id];
  const widths = options.widths || meta.widths;
  const defaultW = options.defaultWidth || meta.defaultWidth || widths[widths.length - 1];
  const dims = imageDimensions(id, defaultW);
  const sizes = options.sizes || '100vw';
  const attrs = [
    'src="' + imagePath(id, defaultW) + '"',
    'srcset="' + imageSrcset(id, widths) + '"',
    'sizes="' + sizes + '"',
    'alt="' + alt.replace(/"/g, '&quot;') + '"',
    'width="' + dims.width + '"',
    'height="' + dims.height + '"',
    'loading="' + (options.loading || 'lazy') + '"',
    'decoding="async"',
  ];
  if (options.className) attrs.push('class="' + options.className + '"');
  return '<img ' + attrs.join(' ') + '>';
}
