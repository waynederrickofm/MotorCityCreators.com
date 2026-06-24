function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  if (!btn) return;
  btn.textContent = "Application Sent — We'll Contact You Within 24 Hours";
  btn.style.background = '#2a6e2a';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Send Application';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
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
  const FALLBACK = 'assets/logo-mark.svg';
  function applyFallback(img) {
    if (img.dataset.logoFallback === '1') return;
    if (!img.getAttribute('src') || img.getAttribute('src').indexOf('logo-mark.svg') !== -1) return;
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
