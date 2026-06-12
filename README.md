# Qubrisource Website

Marketing website for **Qubrisource** — design, marketing, and software solutions for growing businesses. Built as a static multi-page site with no build step required for local development.

**Live site:** [https://www.qubrisource.com](https://www.qubrisource.com)

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- [Bootstrap 5.3](https://getbootstrap.com/) (modals, grid utilities)
- [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts
- [Zoho Forms](https://www.zoho.com/forms/) for contact and quote submissions
- [Sharp](https://sharp.pixelplumbing.com/) (optional) for responsive WebP image generation

## Project Structure

```
├── index.html              # Main landing page
├── blog.html               # Blog listing and article pages
├── assets/
│   ├── css/
│   │   └── styles.css      # Global styles
│   ├── js/
│   │   ├── main.js         # Nav, scroll effects, animations, contact form
│   │   ├── blog.js         # Blog grid and article rendering
│   │   ├── blog-data.js    # Blog post content
│   │   └── images.js       # Responsive image helpers
│   └── images/             # Logos, hero, team, testimonials, etc.
└── scripts/                # Image optimization tooling (Node.js)
```

## Getting Started

No install is required to preview the site. Open `index.html` in a browser, or serve the folder locally:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, services, about, portfolio, team, testimonials, blog preview, contact |
| Blog | `blog.html` | Article listing; individual posts load via `?slug=` query param |

### Blog Articles

Posts are defined in `assets/js/blog-data.js`. Each entry includes a `slug`, title, excerpt, category, date, and HTML content. Article URLs follow this pattern:

```
blog.html?slug=ai-ux-design
```

Meta tags (title, description, Open Graph, Twitter) are updated dynamically in `assets/js/blog.js`.

## SEO & Social Meta

Both pages include:

- Standard SEO tags (`description`, `keywords`, `canonical`, `robots`)
- Open Graph tags (Facebook, Instagram, LinkedIn, WhatsApp link previews)
- Twitter Card tags
- JSON-LD structured data (`Organization` on the home page)

Social preview images use `assets/images/qubrisource-logo-dark.jpeg`. Update absolute URLs in the `<head>` if the production domain changes from `https://www.qubrisource.com`.

## Contact Form

Quote and contact forms submit to Zoho Forms. The form action URL is configured in `index.html` and `blog.html`. On success, a Bootstrap modal confirms submission (handled in `assets/js/main.js`).

**Contact:** [sales@qubrisource.com](mailto:sales@qubrisource.com) · +91 81251 54397

## Image Optimization (Optional)

The `scripts/` folder contains a Node.js setup for generating responsive WebP variants. Image metadata is tracked in `assets/images/manifest.json` and referenced from `assets/js/images.js`.

```bash
cd scripts
npm install
npm run optimize-images
```

## Deployment

Deploy the project root as static files to any host (Netlify, Vercel, S3, GitHub Pages, etc.). Ensure:

1. `index.html` is served at the site root
2. Asset paths under `assets/` remain intact
3. Canonical and Open Graph URLs match the live domain

## License

© 2025 Qubrisource. All rights reserved.
