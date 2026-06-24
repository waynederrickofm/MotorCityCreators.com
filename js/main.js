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
  if (heroMount && template) {
    heroMount.innerHTML = template.trim();
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
  });
}

async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  if (!btn || btn.disabled) return;

  const payload = Object.fromEntries(new FormData(form).entries());
  payload._subject = 'New Motor City Creators Application';
  payload._template = 'table';
  payload._captcha = 'false';

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${APPLICATION_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('submit failed');

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
  } catch {
    btn.textContent = 'Send failed — try again or email wayne@motorcitycreators.com';
    btn.style.background = '#8b2e2e';
    btn.style.color = '#fff';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 6000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupSocialBars();

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
