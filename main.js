// ════════════════════════════════════════════════════════
//  main.js — Portal principal (index.html)
// ════════════════════════════════════════════════════════


// ── HERO SLIDESHOW ──
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  let current = 0;
  let timer;

  if (!slides.length) return;

  const captions = [
    { lugar: 'Plaza Principal',  desc: 'El corazón de Cosoleacaque'      },
    { lugar: 'Iglesia',          desc: 'Costumbres y Fe'          },
    { lugar: 'Centro Deportivo',  desc: 'Cosoleacaque, Veracruz'           },
    { lugar: 'Mercado Regional', desc: 'Productos del sur veracruzano'    },
    { lugar: 'Gente del Sur',    desc: 'Una única experiencia'    },
  ];

  // Caption overlay — se inyecta en el slot reservado para no desplazar el botón
  const hero = document.querySelector('.hero');
  const captionSlot = document.getElementById('hero-caption-slot');
  const captionEl = document.createElement('div');
  captionEl.id = 'hero-caption';
  captionEl.style.cssText = [
    'text-align:center','pointer-events:none',
    'opacity:0','transition:opacity .5s ease',
  ].join(';');
  captionEl.innerHTML =
    '<div id="hc-lugar" style="font-family:\'DM Mono\',monospace;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(242,77,149,.85);margin-bottom:.3rem;">' + captions[0].lugar + '</div>' +
    '<div id="hc-desc"  style="font-family:\'Crimson Pro\',serif;font-style:italic;font-size:.95rem;color:rgba(234,232,245,.5);">' + captions[0].desc + '</div>';
  if (captionSlot) {
    captionSlot.appendChild(captionEl);
  } else {
    captionEl.style.cssText += ';position:absolute;bottom:6rem;left:50%;transform:translateX(-50%);z-index:3;';
    hero.appendChild(captionEl);
  }
  setTimeout(function () { captionEl.style.opacity = '1'; }, 800);

  // Dots
  slides.forEach(function (_, i) {
    var dot = document.createElement('div');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () { goTo(i); });
    dotsContainer.appendChild(dot);
  });

  function updateCaption(idx) {
    var c = captions[idx] || {};
    captionEl.style.opacity = '0';
    setTimeout(function () {
      document.getElementById('hc-lugar').textContent = c.lugar || '';
      document.getElementById('hc-desc').textContent  = c.desc  || '';
      captionEl.style.opacity = '1';
    }, 300);
  }

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    updateCaption(current);
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 5500);
  }

  // Swipe táctil
  var tx = 0;
  hero.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  resetTimer();
})();


// ── SCROLL REVEAL ──
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();


// ── NAV ACTIVE LINK ──
(function () {
  var links    = document.querySelectorAll('nav a');
  var sections = Array.from(links)
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { io.observe(s); });
})();