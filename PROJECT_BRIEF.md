# Motor City Creators Project Brief

## 1. Purpose

This project is a public marketing website for Motor City Creators / Motor City Creator Group LLC. It promotes digital marketing, creator management, platform growth, revenue coaching, and client outcome claims for creators and digital entrepreneurs.

Primary users are prospective creators, clients, business partners, and visitors who want to learn about the company or apply for a free consultation.

The site asks visitors for user data through an application/contact form:

- first name
- last name
- email address
- optional phone number
- area of interest
- free-text goals/message

In the current code, that form does not send data anywhere. The JavaScript prevents normal submission, changes the button text to a success message, waits five seconds, and resets the form. There is no backend, database, email API, analytics API, or form service wired to receive the submitted data.

## 2. Tech Stack

This is a static website.

- HTML: page structure and content.
- CSS: custom responsive styling, branding, layout, animations, and Squarespace-specific override styles.
- JavaScript: small vanilla browser script for scroll reveal animations, active navigation state, revenue bar animation, and fake form-submission feedback.
- Assets: SVG and PNG logo files.
- Fonts: Google Fonts loaded from `fonts.googleapis.com`.
- Hosting observed in production: Netlify serves `https://motorcitycreators.com`.
- DNS/proxy observed in production: `https://www.motorcitycreators.com` redirects to the apex domain and includes Cloudflare headers.

External services and public outbound links:

- Google Fonts: used by every main HTML page.
- Netlify: live hosting for the apex domain.
- Cloudflare: visible in response headers for the `www` redirect path.
- Instagram, X/Twitter, Threads, YouTube, and Discord: footer/contact social links only.
- Email client links: `mailto:` links on the contact page.
- Squarespace: `css/squarespace-custom.css` is a paste-in stylesheet for a Squarespace 7.1 site, but the standalone static pages do not depend on Squarespace at runtime.

The site mentions TikTok, Instagram, YouTube, Snapchat, X, Threads, and OnlyFans as business platforms, but this code does not call their APIs.

## 3. File Structure

- `index.html`: home page and main marketing entry point.
- `about.html`: company mission, leadership, and process overview.
- `services.html`: service descriptions, platform coverage, and comparison table.
- `revenue.html`: revenue model, market statistics, and monetization claims.
- `results.html`: client outcome and case-result marketing page.
- `contact.html`: contact details, social links, and application form.
- `MotorCity_Digital_Marketing.html`: older or alternate single-page version with inline CSS and inline JavaScript.
- `css/style.css`: main stylesheet used by the multi-page static site.
- `css/squarespace-custom.css`: Squarespace 7.1 custom CSS instructions and styles.
- `js/main.js`: shared client-side behavior for animations, active nav state, and the contact form success/reset behavior.
- `assets/logo.svg`: primary SVG logo.
- `assets/logo-mark.svg`: favicon/logo mark.
- `assets/logo-brand.png`: PNG brand asset.
- `css/logo-brand.png`: duplicate or CSS-adjacent PNG logo asset.

## 4. Sensitive Surfaces

### Forms

- `contact.html` contains the main application form.
- `MotorCity_Digital_Marketing.html` contains an older inline version of the same style of form.
- Both forms collect personal contact/application information in the browser.
- Both forms use `handleSubmit(event)` to prevent submission and show a success message.
- No form `action`, HTTP request, email service, database write, or third-party form processor is configured.

### Logins

There are no login, signup, password reset, session, cookie, authentication, or authorization flows in the repository.

### Payments

There are no payment forms, checkout flows, payment provider scripts, Stripe/PayPal/Square references, webhooks, or payment API keys in the repository.

### File Uploads

There are no file upload fields or upload handlers.

### Database Connections

There is no backend code and no database client, connection string, schema, migration, or query code.

### API Keys and Environment Variables

There are no `.env` files, no package config, and no code reading `process.env` or `import.meta.env`.

### Public Contact and Social Links

The project exposes public contact links and social profile URLs in the HTML. These are public marketing links, not secrets.

## 5. Secrets Audit

I scanned the repository for common credential patterns including API keys, tokens, secrets, passwords, bearer tokens, private keys, payment keys, database URLs, and environment-variable references.

No credentials, API keys, tokens, passwords, or private keys were found in the code.

Locations reviewed with secret-relevant content:

- `contact.html`: contains public `mailto:` links and public social URLs. Not a credential; exposed publicly by design.
- `MotorCity_Digital_Marketing.html`: contains public contact text and the older inline application form. Not a credential; exposed publicly by design.
- `css/squarespace-custom.css`: contains Squarespace setup instructions and a Google Fonts URL. Not a credential; exposed publicly by design.

No secret values were printed or copied into this document.

## 6. Status

Finished:

- Static multi-page marketing site exists.
- Home, About, Services, Revenue, Results, and Contact pages exist.
- Shared styling and basic responsive behavior are implemented.
- Navigation and side quick tabs are implemented.
- Scroll reveal and revenue bar animations are implemented.
- Production domain is live and serves the home page content.

In progress or incomplete:

- The application/contact form is only a client-side demo interaction. It does not actually submit or store applications.
- Deployment configuration is not represented in the repository. There is no `netlify.toml`, GitHub Actions workflow, package manifest, or documented deploy process.
- `MotorCity_Digital_Marketing.html` appears to be an older standalone version that duplicates content from the current multi-page site.

Still planned or implied by the site copy:

- Real application intake.
- Real consultation scheduling or email delivery.
- Any operational backend needed for lead capture, CRM, analytics, auth, payments, or account management.

## 7. Known Issues

- The form tells users "Application Sent" even though no data leaves the browser. This is the most important functional gap.
- The form claims confidentiality and a 24-hour response, but the current code has no submission destination.
- There is no privacy policy, terms page, or disclosure explaining how application data would be handled if a real form backend is added.
- There is no deployment documentation in the repo.
- The live domain appears to be on Netlify, but the repo does not contain Netlify configuration or CI/deploy metadata.
- GitHub Pages is not configured for this repository based on the GitHub API response.
- The project has no automated tests, build command, linter, or package manifest.
- Several pages repeat the same nav/footer HTML manually, so future edits must be kept in sync across files.

## 8. Deployment

The site is live at:

- `https://motorcitycreators.com`
- `https://www.motorcitycreators.com`, which redirects to the apex domain

Observed production headers show:

- apex domain served by Netlify
- `www` path passing through Cloudflare and redirecting to the apex domain

The repository itself does not show how deployment is triggered. There is no Netlify config file, GitHub Actions workflow, package manifest, or GitHub Pages configuration in the checked-in files. The deployment is likely managed outside the repository through Netlify's dashboard or a connected Git integration, but that cannot be confirmed from the repo alone.
