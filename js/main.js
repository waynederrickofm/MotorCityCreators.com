const APPLICATION_EMAIL = 'wayne@motorcitycreators.com';

async function loadSocialTemplate() {
  try {
    const res = await fetch('includes/footer-socials.html');
    if (res.ok) return await res.text();
  } catch {
    /* fall through */
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

function buildApplicationFormData(form) {
  const fd = new FormData(form);
  fd.set('_subject', 'New Motor City Creators Application');
  fd.set('_template', 'table');
  fd.set('_captcha', 'false');
  fd.set('_next', `${window.location.origin}/contact.html?submitted=1`);
  const applicantEmail = fd.get('email');
  if (applicantEmail) fd.set('_replyto', applicantEmail);
  return fd;
}

function formSubmitSucceeded(data) {
  return data && (data.success === true || data.success === 'true');
}

function submitApplicationNatively(form) {
  form.action = `https://formsubmit.co/${APPLICATION_EMAIL}`;
  form.method = 'POST';
  form.removeEventListener('submit', handleApplicationSubmit);
  form.submit();
}

async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  if (!btn || btn.disabled) return;

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${APPLICATION_EMAIL}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildApplicationFormData(form),
    });
    const data = await res.json().catch(() => ({}));

    if (formSubmitSucceeded(data)) {
      btn.textContent = "Application Sent — We'll Contact You Within 24 Hours";
      btn.style.background = '#2a6e2a';
      btn.style.color = '#fff';
      form.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 5000);
      return;
    }

    const message = (data.message || '').toLowerCase();
    if (message.includes('activation')) {
      submitApplicationNatively(form);
      return;
    }

    throw new Error(data.message || 'submit failed');
  } catch {
    btn.textContent = 'Retrying delivery...';
    setTimeout(() => submitApplicationNatively(form), 400);
  }
}

function showSubmittedBanner() {
  if (!window.location.search.includes('submitted=1')) return;
  const form = document.querySelector('.application-form');
  if (!form) return;
  const banner = document.createElement('p');
  banner.className = 'form-status-banner';
  banner.textContent = "Application received — we'll contact you within 24 hours.";
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
