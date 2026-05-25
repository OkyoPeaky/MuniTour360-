// ════════════════════════════════════════════════════
//  mejoras.js — Cosoleacaque (munitour360.html)
//  Hamburger nav · Lazy iframe · Lightbox · Scroll btn
// ════════════════════════════════════════════════════
(function () {
  'use strict';

  /* ───────────────────────────────────────────────────
     1. MENÚ HAMBURGUESA — MUNITOUR360
     Panel izquierdo independiente: #muni-panel.
     Overlay estático en HTML: #muni-overlay.
     No comparte nada con el hamburger de index.html.
  ─────────────────────────────────────────────────── */
  var hamburger   = document.getElementById('nav-hamburger');
  var muniPanel   = document.getElementById('muni-panel');
  var muniOverlay = document.getElementById('muni-overlay');

  if (hamburger && muniPanel) {
    function openMenu() {
      hamburger.classList.add('open');
      muniPanel.classList.add('open');
      muniPanel.setAttribute('aria-hidden', 'false');
      if (muniOverlay) muniOverlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      muniPanel.classList.remove('open');
      muniPanel.setAttribute('aria-hidden', 'true');
      if (muniOverlay) muniOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    if (muniOverlay) muniOverlay.addEventListener('click', closeMenu);

    // Cerrar y hacer scroll al destino (evita conflicto con overflow:hidden)
    muniPanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        closeMenu();
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          setTimeout(function () {
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 350);
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }


  /* ───────────────────────────────────────────────────
     2. LAZY LOAD IFRAME (mapa de Google Maps)
  ─────────────────────────────────────────────────── */
  var lazyIframes = document.querySelectorAll('.lazy-iframe[data-src]');
  if (lazyIframes.length && 'IntersectionObserver' in window) {
    var iframeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var f = e.target;
          f.src = f.dataset.src;
          f.removeAttribute('data-src');
          iframeIO.unobserve(f);
        }
      });
    }, { rootMargin: '200px' });
    lazyIframes.forEach(function (f) { iframeIO.observe(f); });
  } else {
    lazyIframes.forEach(function (f) { f.src = f.dataset.src; });
  }


  /* ───────────────────────────────────────────────────
     3. LIGHTBOX DE GALERÍA
  ─────────────────────────────────────────────────── */
  var lb        = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');

  window.openLightbox = function (src, caption) {
    if (!lb) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.focus();
  };

  window.closeLightbox = function () {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) window.closeLightbox();
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.closeLightbox();
    });
    lb.setAttribute('tabindex', '-1');
  }


  /* ───────────────────────────────────────────────────
     4. ARIA LIVE para el slideshow del hero
  ─────────────────────────────────────────────────── */
  var heroSlides = document.querySelector('.hero-slides');
  if (heroSlides) {
    heroSlides.setAttribute('aria-live', 'polite');
    heroSlides.setAttribute('aria-atomic', 'false');
    document.querySelectorAll('.hero-slide').forEach(function (s, i) {
      s.setAttribute('aria-label', 'Imagen ' + (i + 1) + ' del carrusel');
      s.setAttribute('role', 'img');
    });
  }


  /* ───────────────────────────────────────────────────
     5. NAV: resaltar enlace activo al hacer clic
  ─────────────────────────────────────────────────── */
  var navLinksAll = document.querySelectorAll('#nav-links a');
  navLinksAll.forEach(function (a) {
    a.addEventListener('click', function () {
      navLinksAll.forEach(function (l) { l.classList.remove('active'); });
      a.classList.add('active');
    });
  });


  /* ───────────────────────────────────────────────────
     6. BOTÓN "EXPLORAR" — smooth scroll a intro
  ─────────────────────────────────────────────────── */
  var scrollBtn = document.getElementById('scroll-hint-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      var hero   = document.querySelector('.hero');
      var target = null;

      if (hero) {
        var next = hero.nextElementSibling;
        while (next && next.classList.contains('textile-band')) {
          next = next.nextElementSibling;
        }
        if (next && next.tagName === 'NAV') {
          next = next.nextElementSibling;
          while (next && next.classList.contains('textile-band')) {
            next = next.nextElementSibling;
          }
        }
        target = next;
      }

      if (!target) target = document.querySelector('section[id]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

})();