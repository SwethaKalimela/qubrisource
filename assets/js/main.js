/* â•â• NEURAL NETWORK CANVAS â•â• */
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  let W, H, nodes, edges, pulses, raf, running = false, frameSkip = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    const density = isMobile ? 28000 : 20000;
    const N = Math.min(Math.floor((W * H) / density), isMobile ? 18 : 32);
    nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * 0.25,
      vy: (Math.random() - .5) * 0.25,
      r: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.012 + 0.005,
    }));
    edges = [];
    pulses = [];
    buildEdges();
    for (let i = 0; i < (isMobile ? 3 : 6); i++) spawnPulse();
  }

  function buildEdges() {
    edges = [];
    const maxD = Math.min(W, H) * 0.18;
    const maxD2 = maxD * maxD;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) edges.push({ a: i, b: j, maxD, maxD2 });
      }
    }
  }

  function spawnPulse() {
    if (!edges.length) return;
    const e = edges[Math.floor(Math.random() * edges.length)];
    const flip = Math.random() > .5;
    pulses.push({ a: flip ? e.a : e.b, b: flip ? e.b : e.a, t: 0, spd: Math.random() * .005 + .002, w: Math.random() * 1.2 + .5, al: Math.random() * .4 + .2 });
  }

  function frame() {
    if (!running) return;
    if (isMobile && ++frameSkip % 2) {
      raf = requestAnimationFrame(frame);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    const edgeColor = '42,68,230';
    const nodeColor = '42,68,230';

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.phase += n.spd;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    edges.forEach(e => {
      const na = nodes[e.a], nb = nodes[e.b];
      const dx = na.x - nb.x, dy = na.y - nb.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > e.maxD2) return;
      const d = Math.sqrt(d2);
      const al = (1 - d / e.maxD) * 0.08;
      ctx.strokeStyle = `rgba(${edgeColor},${al})`;
      ctx.lineWidth = .5;
      ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
    });

    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      const na = nodes[p.a], nb = nodes[p.b];
      const x = na.x + (nb.x - na.x) * p.t;
      const y = na.y + (nb.y - na.y) * p.t;
      ctx.beginPath(); ctx.arc(x, y, p.w * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeColor},${p.al * 0.8})`; ctx.fill();
      p.t += p.spd;
      if (p.t > 1) { pulses.splice(i, 1); spawnPulse(); }
    }

    nodes.forEach(n => {
      const pulse = .5 + .5 * Math.sin(n.phase);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeColor},${.25 + .15 * pulse})`; ctx.fill();
    });

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    frame();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { stop(); resize(); if (running) start(); }, 150);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (hero) start();
  });

  let ready = false;
  const bootCanvas = () => {
    resize();
    ready = true;
    if (!hero || hero.getBoundingClientRect().bottom > 0) start();
  };

  if (hero && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (!ready) return;
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 });
    heroObserver.observe(hero);
  }

  if ('requestIdleCallback' in window) requestIdleCallback(bootCanvas, { timeout: 1200 });
  else setTimeout(bootCanvas, 1);

  setInterval(() => { if (running) buildEdges(); }, 8000);
})();

/* â•â• MOBILE MENU â•â• */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* â•â• SCROLL EFFECTS â•â• */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
})();

/* â•â• REVEAL ON SCROLL â•â• */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
reveals.forEach(el => revealObserver.observe(el));

/* ══ HERO STATS — count-up on scroll ══ */
(function initHeroStatCountUp() {
  const wrap = document.getElementById('heroStats');
  if (!wrap) return;

  const counters = [...wrap.querySelectorAll('.stat-n[data-count]')];
  if (!counters.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let played = false;

  const format = (value, decimals) =>
    decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));

  const runCounter = (el, delay = 0) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1400;

    const finish = () => { el.textContent = `${format(target, decimals)}${suffix}`; };

    if (reducedMotion) {
      finish();
      return;
    }

    const start = () => {
      const t0 = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${format(target * eased, decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
        else finish();
      };
      requestAnimationFrame(tick);
    };

    delay ? setTimeout(start, delay) : start();
  };

  const playAll = () => {
    if (played) return;
    played = true;
    counters.forEach((el, i) => runCounter(el, i * 90));
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      playAll();
      observer.disconnect();
    }
  }, { threshold: 0.25, rootMargin: '0px 0px -20px 0px' });

  observer.observe(wrap);

  if (wrap.getBoundingClientRect().top < window.innerHeight * 0.85) {
    playAll();
  }
})();

/* ══ PROCESS — staggered scroll animations + timeline line ══ */
(function initProcessAnimations() {
  const grid = document.getElementById('processGrid');
  if (!grid) return;
  const steps = [...grid.querySelectorAll('.proc-step')];
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const idx = steps.indexOf(e.target);
      e.target.style.transitionDelay = `${idx * 120}ms`;
      e.target.classList.add('in');
      stepObserver.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  steps.forEach((step) => stepObserver.observe(step));
  const lineObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      grid.classList.add('line-in');
      lineObserver.unobserve(grid);
    }
  }, { threshold: 0.15 });
  lineObserver.observe(grid);
})();

/* â•â• PORTFOLIO FILTER â•â• */
function filterPortfolio(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.p-card').forEach(card => {
    const show = cat === 'all' || (card.dataset.cat || '').includes(cat);
    card.style.cssText = `opacity:${show ? 1 : 0.2};transform:scale(${show ? 1 : 0.96});transition:all .3s`;
  });
}

/* â•â• STAGGER REVEALS â•â• */
document.querySelectorAll('.services-grid .srv-card, .testi-grid .testi-card, .portfolio-grid .p-card, .cases-grid .case-card, .blog-grid .blog-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 50}ms`;
});

/* â•â• TEAM CAROUSEL â•â• */
(function initTeamCarousel() {
  const wrap = document.getElementById('teamCarousel');
  if (!wrap) return;

  const track = wrap.querySelector('.team-carousel-track');
  const cards = [...wrap.querySelectorAll('.team-card')];

  const prevBtn = wrap.querySelector('.team-carousel-prev');
  const nextBtn = wrap.querySelector('.team-carousel-next');
  const dotsWrap = wrap.querySelector('.team-carousel-dots');
  const viewport = wrap.querySelector('.team-carousel-viewport');

  let index = 0;
  let perView = 4;
  let pages = 1;

  function getPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1100) return 3;
    return 4;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'team-carousel-dot' + (i === index ? ' active' : '');
      dot.setAttribute('aria-label', `Go to team page ${i + 1}`);
      dot.addEventListener('click', () => { index = i; update(); });
      dotsWrap.appendChild(dot);
    }
  }

  function setCardSizes() {
    perView = getPerView();
    const styles = getComputedStyle(viewport);
    const gap = parseFloat(styles.getPropertyValue('--team-gap')) || 24;
    const viewportWidth = viewport.clientWidth;
    const cardWidth = (viewportWidth - gap * (perView - 1)) / perView;
    viewport.style.setProperty('--team-card-width', `${cardWidth}px`);
    return { gap, cardWidth };
  }

  function update() {
    perView = getPerView();
    pages = Math.max(1, Math.ceil(cards.length / perView));
    if (index > pages - 1) index = pages - 1;

    const { gap, cardWidth } = setCardSizes();
    const offset = index * perView * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= pages - 1;

    dotsWrap.querySelectorAll('.team-carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function refresh() {
    const oldPages = pages;
    perView = getPerView();
    pages = Math.max(1, Math.ceil(cards.length / perView));
    if (pages !== oldPages) buildDots();
    update();
  }

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; update(); } });
  nextBtn.addEventListener('click', () => { if (index < pages - 1) { index++; update(); } });

  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && index < pages - 1) index++;
      else if (diff < 0 && index > 0) index--;
      update();
    }
  }, { passive: true });

  wrap.querySelectorAll('.team-photo img.team-img').forEach(img => {
    if (img.getAttribute('src')) img.closest('.team-photo').classList.add('has-img');
  });

  buildDots();
  refresh();
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => refresh()).observe(viewport);
  }
})();

/* ══ ZOHO FORM — iframe submit + success modal (no paid redirect) ══ */
(function initZohoForm() {
  const form = document.getElementById('quote-form');
  const iframe = document.getElementById('zoho-submit-frame');
  const modalEl = document.getElementById('formSuccessModal');
  if (!form || !iframe) return;

  const submitBtn = form.querySelector('.btn-submit');
  const defaultBtnText = submitBtn?.textContent || 'Send';
  const serviceSelect = form.querySelector('#quote-service');
  const modal = modalEl && typeof bootstrap !== 'undefined'
    ? bootstrap.Modal.getOrCreateInstance(modalEl)
    : null;
  const successMessage = 'Thank you! Your form has been submitted successfully. We\'ll get back to you within 24 hours.';
  let pending = false;
  let submitTimeout;

  function resetSubmitButton() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.textContent = defaultBtnText;
  }

  function resetFormFields() {
    form.reset();
    if (serviceSelect) serviceSelect.selectedIndex = 0;
  }

  function onSubmitSuccess() {
    if (!pending) return;
    pending = false;
    clearTimeout(submitTimeout);
    resetFormFields();
    resetSubmitButton();
    const quoteModalEl = document.getElementById('quoteModal');
    if (quoteModalEl && typeof bootstrap !== 'undefined') {
      const quoteModal = bootstrap.Modal.getInstance(quoteModalEl);
      if (quoteModal) quoteModal.hide();
    }
    if (modal) modal.show();
    else alert(successMessage);
  }

  form.addEventListener('submit', () => {
    pending = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    clearTimeout(submitTimeout);
    submitTimeout = setTimeout(() => {
      if (!pending) return;
      pending = false;
      resetSubmitButton();
      alert('Something went wrong. Please try again or email us at sales@qubrisource.com.');
    }, 30000);
  });

  iframe.addEventListener('load', onSubmitSuccess);
})();


