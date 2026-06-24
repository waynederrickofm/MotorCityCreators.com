# Motor City Creators

A static marketing website (plain HTML/CSS/JS, no framework, no build step) for the
"Motor City Creators" digital marketing / creator management agency.

## Cursor Cloud specific instructions

- **Stack:** Static HTML/CSS/vanilla JS. There is no `package.json`, no lockfile, no
  build system, and no backend. Nothing needs to be installed to run it.
- **Run it (dev):** Serve the repo root with any static file server, e.g.
  `python3 -m http.server 8000` (Python 3 is preinstalled), then open
  `http://localhost:8000/index.html`. Opening the HTML files via `file://` also works,
  but serving via HTTP is the correct way to exercise relative asset paths.
- **Pages:** `index.html`, `about.html`, `services.html`, `revenue.html`,
  `results.html`, `contact.html`, and the standalone `MotorCity_Digital_Marketing.html`.
- **Contact/application form** (`contact.html` + `js/main.js`): submits via
  [FormSubmit](https://formsubmit.co) AJAX to `wayne@motorcitycreators.com`. Requires a
  one-time activation link in that inbox on first submission. Forms use class
  `application-form` and collect `main_social` + `what_you_do` fields.
- **External dependency:** Google Fonts CDN is used for brand fonts only; the site
  renders fine with fallback fonts if the CDN is blocked.
- **Lint/test/build:** None are defined for this project (no tooling configured).
- **Brand assets:** `assets/brand/` holds the logo set (`logo-primary.png`, `logo-icon.png`
  social avatar, `social-banner.png` cover, `logo-light.png`). `logo-icon.png` is the
  square social/app avatar; `social-banner.png` is used as the `og:image` on `index.html`.
- **Promo videos:** `assets/promo/brand-promo.mp4` (16:9) and `social-promo-square.mp4`
  (1:1) are animated brand promos. `promo.html` / `promo-square.html` are the
  self-contained CSS animations behind them; the `.mp4` files were rendered with `ffmpeg`
  from `assets/brand/` images (DejaVu fonts), so they can be regenerated without a browser.
- **Socials:** All pages link the same 6 platforms (Instagram, TikTok, YouTube, Discord,
  Threads, X) via the footer `.footer-socials` icon bar; `contact.html` also has a labeled
  `.social-section`. Update handles in one place per file if they change.
