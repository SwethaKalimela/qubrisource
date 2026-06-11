/* â•â• NEURAL NETWORK CANVAS â•â• */
(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, edges, pulses, raf;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    const N = Math.floor((W * H) / 16000);
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
    for (let i = 0; i < 6; i++) spawnPulse();
  }

  function buildEdges() {
    edges = [];
    const maxD = Math.min(W, H) * 0.18;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < maxD) edges.push({ a: i, b: j, maxD });
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
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > e.maxD) return;
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

  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); frame(); });
  resize(); frame();
  setInterval(buildEdges, 5000);
})();

/* â•â• MOBILE MENU â•â• */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* â•â• SCROLL EFFECTS â•â• */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

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
  // #region agent log
  (function debugTeamSocials() {
    const socialBlocks = wrap.querySelectorAll('.team-socials');
    const firstCard = cards[0];
    const firstInfo = firstCard && firstCard.querySelector('.team-info');
    const sampleLink = socialBlocks[0] && socialBlocks[0].querySelector('a');
    const cardStyle = firstCard ? getComputedStyle(firstCard) : null;
    const hasTeamSocialsRule = (function () {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            if (rule.selectorText && rule.selectorText.includes('.team-socials')) return true;
          }
        } catch (_) { /* cross-origin */ }
      }
      return false;
    })();
    const sampleLinkStyle = sampleLink ? getComputedStyle(sampleLink) : null;
    fetch('http://127.0.0.1:7352/ingest/52a606f6-7120-4380-ab7d-85788f780c60',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'53054c'},body:JSON.stringify({sessionId:'53054c',location:'main.js:team-carousel',message:'team socials audit',data:{cardCount:cards.length,socialBlockCount:socialBlocks.length,socialLinkCount:wrap.querySelectorAll('.team-socials a').length,firstCardHasSocials:!!(firstInfo&&firstInfo.querySelector('.team-socials')),hasTeamSocialsCssRule:hasTeamSocialsRule,sampleLinkDisplay:sampleLinkStyle?sampleLinkStyle.display:null,sampleLinkVisible:sampleLink?sampleLink.offsetParent!==null:null,cardOverflow:cardStyle?cardStyle.overflow:null},timestamp:Date.now(),runId:'post-fix',hypothesisId:'verify'})}).catch(()=>{});
    const viewportEl = wrap.querySelector('.team-carousel-viewport');
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () {
        var vp = viewportEl.getBoundingClientRect();
        var cr = card.getBoundingClientRect();
        var cs = getComputedStyle(card);
        var vcs = viewportEl ? getComputedStyle(viewportEl) : null;
        fetch('http://127.0.0.1:7352/ingest/52a606f6-7120-4380-ab7d-85788f780c60',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'53054c'},body:JSON.stringify({sessionId:'53054c',location:'main.js:team-card-hover',message:'team card hover clip audit',data:{cardIndex:i,inlineTransitionDelay:card.style.transitionDelay,computedTransitionDelay:cs.transitionDelay,transform:cs.transform,transitionDuration:cs.transitionDuration},timestamp:Date.now(),runId:'hover-speed-post-fix',hypothesisId:'B'})}).catch(()=>{});
      });
    });
  })();
  // #endregion
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

// #region agent log
(function () {
  const af1 = document.querySelector('.about-float.af1');
  const af2 = document.querySelector('.about-float.af2');
  const aboutVisual = document.querySelector('.about-visual');
  const aboutImg = document.querySelector('.about-img');
  if (af1 && aboutVisual && aboutImg) {
    const cs1 = getComputedStyle(af1);
    const csV = getComputedStyle(aboutVisual);
    const r1 = af1.getBoundingClientRect();
    const rImg = aboutImg.getBoundingClientRect();
    fetch('http://127.0.0.1:7352/ingest/52a606f6-7120-4380-ab7d-85788f780c60',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'53054c'},body:JSON.stringify({sessionId:'53054c',location:'main.js:about-float',message:'about float position audit',data:{af1ComputedLeft:cs1.left,af1Position:cs1.position,af2ComputedRight:getComputedStyle(af2).right,visualOverflow:csV.overflow,af1LeftVsImage:r1.left-rImg.left,af1OverlapsImageLeft:r1.left<rImg.left,imageLeft:rImg.left,floatLeft:r1.left},timestamp:Date.now(),runId:'about-float-post-fix',hypothesisId:'A-B'})}).catch(()=>{});
  }
})();
(function () {
  document.querySelectorAll('.case-hero img').forEach((img, i) => {
    const cardIndex = i + 1;
    const log = (message, data, hypothesisId) => {
      fetch('http://127.0.0.1:7352/ingest/52a606f6-7120-4380-ab7d-85788f780c60', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'fc1f9b' },
        body: JSON.stringify({
          sessionId: 'fc1f9b',
          runId: 'post-fix',
          hypothesisId,
          location: 'main.js:case-hero-img',
          message,
          data,
          timestamp: Date.now()
        })
      }).catch(() => {});
    };
    if (img.complete && img.naturalWidth > 0) {
      log('case study image loaded', { cardIndex, src: img.currentSrc || img.src, naturalWidth: img.naturalWidth }, 'H1');
    } else if (img.complete) {
      log('case study image broken', { cardIndex, src: img.currentSrc || img.src, naturalWidth: img.naturalWidth }, 'H1');
    }
    img.addEventListener('load', () => {
      log('case study image loaded', { cardIndex, src: img.currentSrc || img.src, naturalWidth: img.naturalWidth }, 'H1');
    });
    img.addEventListener('error', () => {
      log('case study image error', { cardIndex, src: img.currentSrc || img.src }, 'H1');
    });
  });
})();
// #endregion
