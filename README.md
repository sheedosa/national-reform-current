# التيار الوطني الإصلاحي — National Reform Movement

Bilingual (Arabic / English) single-page site. Plain HTML, CSS and JavaScript: no build step, no dependencies, fonts self-hosted.

Live: https://sheedosa.github.io/national-reform-current/

## Editing

- **Text**: `index.html`. Every piece of copy appears twice, as `<span class="ar">…</span>` and `<span class="en">…</span>`.
- **Portrait**: save a photo as `assets/portrait.jpg` (4:5, about 800×1000). It replaces the logo in the Nasser Al-Senussi section automatically.
- **Email**: set `EMAIL` at the top of `assets/main.js`; the email button then appears in the contact section.
- **Logo**: `assets/logo.png` and `assets/logo-112.png` (cropped from the Facebook profile image; replace with the original artwork when available).
- **Colours and type**: variables at the top of `assets/styles.css`.
- **Language link**: add `?lang=en` or `?lang=ar` to the URL to open in a given language.

## Run locally

    python3 -m http.server 8000
