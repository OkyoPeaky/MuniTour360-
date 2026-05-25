// ════════════════════════════════════════════════════
//  main2.js — INMERSIAKS (index.html)
//  Partículas · Nav scroll · Fade-in · Form · Hamburger
// ════════════════════════════════════════════════════

// ── PARTÍCULAS DE FONDO ──────────────────────────────
(function () {
  var canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = [];
    var n = Math.floor((W * H) / 14000);
    for (var i = 0; i < n; i++) {
      dots.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r:  Math.random() * 1.5 + 0.3,
        a:  Math.random() * 0.5 + 0.15
      });
    }
  }

  function drawDots() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(77,184,255,' + d.a + ')';
      ctx.fill();
    }
    for (var i = 0; i < dots.length; i++) {
      for (var j = i + 1; j < dots.length; j++) {
        var dx   = dots[i].x - dots[j].x;
        var dy   = dots[i].y - dots[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(77,184,255,' + (0.06 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawDots);
  }

  resize(); initDots(); drawDots();
  window.addEventListener('resize', function () { resize(); initDots(); });
})();


// ── NAV: clase "scrolled" al bajar ───────────────────
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ── FADE-IN AL HACER SCROLL ──────────────────────────
(function () {
  var els = document.querySelectorAll('.fade-up');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();


// ── FORMULARIO DE CONTACTO ────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('.btn-submit');
  if (!btn) return;
  btn.textContent = '✓ Mensaje enviado';
  btn.style.background = 'linear-gradient(135deg,#27AE60,#0F5132)';
  setTimeout(function () {
    btn.textContent = 'Enviar mensaje ✈';
    btn.style.background = '';
  }, 3000);
}


// ── MENÚ HAMBURGUESA — CORPORATIVO ───────────────────
// Solo actúa sobre elementos de index.html; no toca nada de munitour.
(function () {
  var btn     = document.getElementById('corp-hamburger');
  var panel   = document.getElementById('corp-mobile-nav');
  var overlay = document.getElementById('corp-mobile-overlay');

  // Si no existe el botón en esta página, no hacer nada
  if (!btn || !panel) return;

  function open() {
    btn.classList.add('open');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    btn.classList.contains('open') ? close() : open();
  });

  if (overlay) overlay.addEventListener('click', close);

  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      close();
      // Para anclas internas: esperar a que cierre el panel (350ms)
      // antes de hacer scroll, porque overflow:hidden bloquea el scroll.
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
    if (e.key === 'Escape') close();
  });

  // En desktop (≥969px), cerrar el panel si estaba abierto por resize
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 969) close();
  });
})();