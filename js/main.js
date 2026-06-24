const APPLICATION_EMAIL = 'wayne@motorcitycreators.com';
const APPLICATION_RETURN_URL = 'https://www.motorcitycreators.com/about.html?submitted=1';
const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${APPLICATION_EMAIL}`;

const SOCIAL_TEMPLATE_PATHS = [
  '/assets/footer-socials.html',
  'assets/footer-socials.html',
  '/includes/footer-socials.html',
  'includes/footer-socials.html',
];

async function loadSocialTemplate() {
  for (const path of SOCIAL_TEMPLATE_PATHS) {
    try {
      const res = await fetch(path);
      if (res.ok) return await res.text();
    } catch {
      /* try next path */
    }
  }
  return '';
}

async function setupSocialBars() {
  const template = await loadSocialTemplate();

  const heroMount = document.getElementById('hero-socials');
  const contactMount = document.getElementById('contact-socials');

  if (template) {
    if (heroMount) heroMount.innerHTML = template.trim();
    if (contactMount) contactMount.innerHTML = template.trim();
  }

  document.querySelectorAll('footer').forEach((footer) => {
    let bottom = footer.querySelector('.footer-bottom');
    if (!bottom) {
      bottom = document.createElement('div');
      bottom.className = 'footer-bottom';
      const legacy = footer.querySelector('.footer-inner');
      if (legacy) {
        while (legacy.firstChild) bottom.appendChild(legacy.firstChild);
        legacy.replaceWith(bottom);
      } else {
        footer.appendChild(bottom);
      }
    }

    let socials = footer.querySelector('.footer-socials');

    if (template) {
      const wrap = document.createElement('div');
      wrap.innerHTML = template.trim();
      const fresh = wrap.firstElementChild;
      if (socials) {
        socials.replaceWith(fresh);
      } else {
        bottom.insertBefore(fresh, bottom.firstChild);
      }
      socials = fresh;
    } else if (!socials) {
      /* no template and no existing icons */
    } else if (!bottom.contains(socials)) {
      bottom.insertBefore(socials, bottom.firstChild);
    }

    footer.querySelectorAll('.footer-col').forEach((col) => {
      const heading = col.querySelector('h5');
      if (heading && heading.textContent.trim().toLowerCase() === 'connect') col.remove();
    });
    footer.querySelectorAll('.footer-grid .footer-socials').forEach((el) => {
      if (!footer.querySelector('.footer-bottom')?.contains(el)) el.remove();
    });
  });
}

function fieldValue(form, name) {
  const el = form.querySelector(`[name="${name}"]`);
  if (!el) return '';
  return String(el.value || '').trim();
}

function buildApplicationSummary(form) {
  const first = fieldValue(form, 'first_name');
  const last = fieldValue(form, 'last_name');
  const lines = [
    'MOTOR CITY CREATORS — NEW APPLICATION',
    '=====================================',
    '',
    `Name: ${first} ${last}`.trim(),
    `Email: ${fieldValue(form, 'email') || '(not provided)'}`,
    `Phone: ${fieldValue(form, 'phone') || '(not provided)'}`,
    `Main Social: ${fieldValue(form, 'main_social') || '(not provided)'}`,
    `Interested In: ${fieldValue(form, 'interest') || '(not provided)'}`,
    '',
    'What They Do:',
    fieldValue(form, 'what_you_do') || '(not provided)',
    '',
    'Goals & Revenue Targets:',
    fieldValue(form, 'goals') || '(not provided)',
  ];
  return lines.join('\n');
}

function ensureHiddenField(form, name, value) {
  let el = form.querySelector(`[name="${name}"]`);
  if (!el) {
    el = document.createElement('input');
    el.type = 'hidden';
    el.name = name;
    form.appendChild(el);
  }
  el.value = value;
}

function syncFormHiddenFields(form) {
  const summary = buildApplicationSummary(form);
  ensureHiddenField(form, 'message', summary);
  ensureHiddenField(form, 'application_summary', summary);

  const next = form.querySelector('[name="_next"]');
  if (next) next.value = APPLICATION_RETURN_URL;

  const subject = form.querySelector('[name="_subject"]');
  if (subject) {
    const name = `${fieldValue(form, 'first_name')} ${fieldValue(form, 'last_name')}`.trim();
    subject.value = name ? `New MCC Application — ${name}` : 'New Motor City Creators Application';
  }

  const email = fieldValue(form, 'email');
  if (!email) return;

  ensureHiddenField(form, '_replyto', email);
}

function formDataToUrlEncoded(form) {
  const params = new URLSearchParams();
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') params.append(key, value);
  });
  return params.toString();
}

function formSubmitSucceeded(data) {
  return data && (data.success === true || data.success === 'true');
}

function showFormBanner(form, message, type = 'success') {
  form.querySelector('.form-status-banner, .form-error-banner')?.remove();
  const banner = document.createElement('p');
  banner.className = type === 'error' ? 'form-error-banner' : 'form-status-banner';
  banner.textContent = message;
  form.insertBefore(banner, form.firstChild);
}

function deliverApplicationNatively(form) {
  syncFormHiddenFields(form);
  form.removeEventListener('submit', handleApplicationSubmit);
  form.submit();
}

async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  if (!btn || btn.disabled) return;

  if (form.querySelector('[name="_honey"]')?.value) return;

  syncFormHiddenFields(form);

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  form.querySelector('.form-error-banner')?.remove();

  try {
    const res = await fetch(FORMSUBMIT_AJAX, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formDataToUrlEncoded(form),
    });
    const data = await res.json().catch(() => ({}));

    if (formSubmitSucceeded(data)) {
      window.location.href = APPLICATION_RETURN_URL;
      return;
    }

    const message = (data.message || '').toLowerCase();
    if (message.includes('activation')) {
      showFormBanner(
        form,
        'Almost there — check wayne@motorcitycreators.com for a FormSubmit activation email and click the link once. Then submit again.',
        'error'
      );
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }
  } catch {
    /* fall through to native POST */
  }

  btn.textContent = 'Delivering...';
  deliverApplicationNatively(form);
}

function showSubmittedBanner() {
  if (!window.location.search.includes('submitted=1')) return;

  const text =
    'Application received — thank you! A real Motor City Creators team member will review it. Replies come from our team (not an auto-bot) and may take a little time — please check spam. Read below to learn more about us while you wait.';

  const banner = document.createElement('p');
  banner.className = 'form-status-banner application-thanks-banner';
  banner.textContent = text;

  const aboutHero = document.querySelector('.page-hero-inner');
  if (aboutHero) {
    aboutHero.insertBefore(banner, aboutHero.firstChild);
    window.history.replaceState({}, '', window.location.pathname);
    banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const form = document.querySelector('.application-form');
  if (!form) return;
  form.insertBefore(banner, form.firstChild);
  window.history.replaceState({}, '', window.location.pathname);
}

document.addEventListener('DOMContentLoaded', () => {
  setupSocialBars();
  showSubmittedBanner();

  document.querySelectorAll('.application-form').forEach((form) => {
    form.addEventListener('submit', handleApplicationSubmit);
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

  const panel = document.querySelector('.hero-panel');
  if (panel) {
    const barObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.bar-fill').forEach((b) => b.classList.add('animated'));
            barObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barObs.observe(panel);
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.nav-links a[data-page="${page}"], .quick-tab[data-page="${page}"]`).forEach((el) => {
      el.classList.add('active');
    });
  }
});

// Any image that can't load is swapped for the Motor City Creators logo,
// so there are never broken/unavailable pictures on the site.
(function () {
  const FALLBACK = 'assets/logo-brand.png';
  function applyFallback(img) {
    if (img.dataset.logoFallback === '1') return;
    const src = img.getAttribute('src') || '';
    if (src.indexOf('logo-brand.png') !== -1 || src.indexOf('logo-mark.svg') !== -1) return;
    img.dataset.logoFallback = '1';
    img.src = FALLBACK;
    img.style.objectFit = 'contain';
    img.style.background = '#0A0A0A';
  }
  function scan() {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => applyFallback(img));
      if (img.complete && img.naturalWidth === 0) applyFallback(img);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();
