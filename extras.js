// ═══════════════════════════════════════════════════
//  extras.js — Cosoleacaque
//  Scroll-to-top · WOW animations · Capture game
// ═══════════════════════════════════════════════════

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     1. SCROLL TO TOP
  ───────────────────────────────────────────────── */
  const btn = document.getElementById('scroll-top');
  if (btn) {
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 380);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────
     2. WOW SCROLL ANIMATIONS
     All .wow-card elements animate in on scroll
  ───────────────────────────────────────────────── */
  const wowIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        wowIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.wow-card').forEach(function (el) {
    wowIO.observe(el);
  });

  /* ─────────────────────────────────────────────────
     3. CAPTURE GAME — "Vive Cosoleacaque"
  ───────────────────────────────────────────────── */
  const ELEMENTS = [
    { id: 'tamal',    emoji: '🫔', name: 'Tamal de Chipilín', pts: 15 },
    { id: 'popo',     emoji: '🥛', name: 'El Popo',           pts: 20 },
    { id: 'pan',      emoji: '🍞', name: 'Pan Riñón',         pts: 15 },
    { id: 'jarana',   emoji: '🎸', name: 'Jarana',            pts: 25 },
    { id: 'palma',    emoji: '🌴', name: 'Palma Coyul',       pts: 10 },
    { id: 'petate',   emoji: '🪮', name: 'Petate',            pts: 10 },
    { id: 'cempas',   emoji: '🌼', name: 'Cempasúchil',       pts: 12 },
    { id: 'copal',    emoji: '🕯️', name: 'Copal',             pts: 18 },
  ];

  const field        = document.getElementById('capture-field');
  const scoreEl      = document.getElementById('capture-score-val');
  const caughtEl     = document.getElementById('capture-caught-val');
  const startBtn     = document.getElementById('capture-start');
  const progressFill = document.getElementById('capture-progress-fill');
  const rewardModal  = document.getElementById('capture-reward');
  const rewardClose  = document.getElementById('reward-close');
  const slots        = document.querySelectorAll('.collect-slot');

  if (!field || !startBtn) return;

  let score       = 0;
  let caughtCount = 0;
  let caughtSet   = new Set();
  let targets     = [];
  let gameActive  = false;
  let spawnTimer  = null;
  const TOTAL     = ELEMENTS.length;

  function updateHUD() {
    if (scoreEl) scoreEl.textContent = score;
    if (caughtEl) caughtEl.textContent = caughtCount + '/' + TOTAL;
    const pct = (caughtSet.size / TOTAL) * 100;
    if (progressFill) progressFill.style.width = pct + '%';

    // update collection slots
    slots.forEach(function (sl) {
      const id = sl.dataset.item;
      sl.classList.toggle('captured', caughtSet.has(id));
    });
  }

  function spawnTarget() {
    if (!gameActive) return;
    if (targets.length >= 4) return;

    const el   = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const node = document.createElement('div');
    node.className      = 'capture-target';
    node.textContent    = el.emoji;
    node.dataset.id     = el.id;
    node.dataset.pts    = el.pts;
    node.dataset.name   = el.name;
    node.title          = el.name;
    node.style.left     = (8 + Math.random() * 78) + '%';
    node.style.top      = (8 + Math.random() * 74) + '%';
    node.style.animationDuration = (2.5 + Math.random() * 2) + 's';

    node.addEventListener('click', function () {
      if (node.classList.contains('caught')) return;
      catchTarget(node, el);
    });

    field.appendChild(node);
    targets.push(node);

    // auto-escape after 4-6s
    const escapeTime = 4000 + Math.random() * 2000;
    setTimeout(function () {
      if (node.parentNode && !node.classList.contains('caught')) {
        node.style.transition = 'opacity 0.4s, transform 0.4s';
        node.style.opacity = '0';
        node.style.transform = 'scale(0.5)';
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
          targets = targets.filter(function (t) { return t !== node; });
        }, 400);
      }
    }, escapeTime);
  }

  function catchTarget(node, el) {
    node.classList.add('caught');
    score += el.pts;
    caughtCount++;
    if (!caughtSet.has(el.id)) caughtSet.add(el.id);
    updateHUD();

    // splash text
    const splash = document.createElement('div');
    splash.className   = 'capture-splash';
    splash.textContent = '+' + el.pts + ' · ' + el.name;
    splash.style.left  = node.style.left;
    splash.style.top   = (parseFloat(node.style.top) - 8) + '%';
    field.appendChild(splash);
    setTimeout(function () {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 900);

    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
      targets = targets.filter(function (t) { return t !== node; });
    }, 500);

    // check collection complete
    if (caughtSet.size === TOTAL) {
      setTimeout(function () { showReward(); }, 600);
    }
  }

  function startGame() {
    if (gameActive) return;
    gameActive  = true;
    score       = 0;
    caughtCount = 0;
    caughtSet   = new Set();
    targets     = [];
    field.innerHTML = '';
    updateHUD();
    startBtn.textContent = '🎯 ¡En curso! Toca los elementos';
    startBtn.disabled = true;
    startBtn.style.opacity = '0.6';

    // spawn loop
    spawnTarget();
    spawnTimer = setInterval(function () {
      spawnTarget();
    }, 1800);

    // end game after 45 seconds
    setTimeout(function () {
      endGame();
    }, 45000);
  }

  function endGame() {
    gameActive = false;
    clearInterval(spawnTimer);
    targets.forEach(function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    targets = [];
    startBtn.disabled = false;
    startBtn.style.opacity = '';
    startBtn.textContent = '▶ Jugar de nuevo';

    if (caughtSet.size < TOTAL) {
      // Partial reward
      const hint = document.createElement('p');
      hint.className = 'capture-hint';
      hint.style.marginTop = '0.5rem';
      hint.textContent = '¡Conseguiste ' + caughtSet.size + '/' + TOTAL + ' elementos! Puntos: ' + score + ' · Juega de nuevo para completar la colección.';
      const old = field.nextElementSibling;
      if (old && old.classList.contains('capture-hint-end')) old.remove();
      hint.classList.add('capture-hint-end');
      field.parentNode.insertBefore(hint, field.nextSibling);
      setTimeout(function () { hint.remove(); }, 8000);
    }
  }

  function showReward() {
    endGame();
    if (rewardModal) rewardModal.classList.add('show');
  }

  startBtn.addEventListener('click', startGame);
  if (rewardClose) {
    rewardClose.addEventListener('click', function () {
      rewardModal.classList.remove('show');
    });
  }

})();
