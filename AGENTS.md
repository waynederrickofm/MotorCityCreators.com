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
- **Contact/application form** (`contact.html` + `js/main.js` `handleSubmit`): it is a
  client-side mock only. It calls `preventDefault()`, swaps the button to an
  "Application Sent" confirmation for 5s, then resets the form. There is no network
  request, email service, or backend — do not expect submissions to be stored anywhere.
- **External dependency:** Google Fonts CDN is used for brand fonts only; the site
  renders fine with fallback fonts if the CDN is blocked.
- **Lint/test/build:** None are defined for this project (no tooling configured).
