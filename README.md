# التيار الوطني الإصلاحي — National Reform Movement

Bilingual (Arabic / English) single-page site. Plain HTML, CSS and JavaScript: no build step, no dependencies, fonts self-hosted.

Live: https://sheedosa.github.io/national-reform-current/

## Editing

The site has two built pages: Arabic at `/` (main) and English at `/en/`.

1. Edit **`src/index.html`**. Every piece of copy appears twice, as `<span class="ar">…</span>` and `<span class="en">…</span>`.
2. Run **`python3 build.py`** (needs `pip install beautifulsoup4`). It writes `index.html`, `en/index.html` and `sitemap.xml`.
3. Commit and push. Do not edit `index.html` or `en/index.html` by hand.

- **Portrait**: add a photo as `assets/portrait.jpg` (4:5, about 800×1000) and set `PORTRAIT = 'assets/portrait.jpg'` in `assets/main.js`.
- **Email**: set `EMAIL` at the top of `assets/main.js`; the email button then appears in the contact section.
- **Logo and icons**: `assets/logo-512.png`, `logo-88.*`, `icon-192.png`, `apple-touch-icon.png`, `favicon-48.png`.
- **Social share images**: `assets/og.png` (Arabic) and `assets/og-en.png` (English), 1200×630.
- **Colours and type**: variables at the top of `assets/styles.css`.
- **Custom domain**: if you add one, replace `https://sheedosa.github.io/national-reform-current/` in `src/index.html`, `build.py`, `robots.txt` and `404.html`, then rebuild.

## Run locally

    python3 -m http.server 8000
