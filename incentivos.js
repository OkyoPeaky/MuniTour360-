// ════════════════════════════════════════════════════════
//  MERCADO 360° — Cosoleacaque
//  incentivos.js — Sistema de puntos, misiones y ranking
// ════════════════════════════════════════════════════════

const INCENTIVOS = (function () {

  // ── CONFIGURACIÓN ──
  const MISIONES = [
    {
      id: 'foto1',
      icon: '📸',
      titulo: 'Primera Foto',
      desc: 'Sube tu primera foto del mercado o de un puesto local.',
      pts: 50,
      tipo: 'foto',
      recompensa: null,
    },
    {
      id: 'resena1',
      icon: '✍️',
      titulo: 'Primera Reseña',
      desc: 'Deja una reseña honesta de cualquier puesto del mercado.',
      pts: 40,
      tipo: 'resena',
      recompensa: null,
    },
    {
      id: 'foto3',
      icon: '🖼️',
      titulo: 'Fotógrafo del Mercado',
      desc: 'Sube 3 fotos del mercado o sus puestos.',
      pts: 120,
      tipo: 'foto',
      meta: 3,
      recompensa: { desc: '10% de descuento en Dulcería "Los Sabores"', codigo: 'DULCE10' },
    },
    {
      id: 'resena3',
      icon: '⭐',
      titulo: 'Voz del Mercado',
      desc: 'Deja reseña en 3 puestos diferentes.',
      pts: 100,
      tipo: 'resena',
      meta: 3,
      recompensa: { desc: '15% de descuento en Mariscos "Don Chago"', codigo: 'CHAGO15' },
    },
    {
      id: 'combo1',
      icon: '🏆',
      titulo: 'Embajador Cosolea',
      desc: 'Sube 5 fotos Y deja 5 reseñas.',
      pts: 300,
      tipo: 'combo',
      meta: { foto: 5, resena: 5 },
      recompensa: { desc: '20% de descuento en cualquier puesto del mercado', codigo: 'EMBAJADOR20' },
    },
  ];

  const NIVELES = [
    { nombre: 'Visitante',    min: 0,   icon: '🌱', color: '#9B96C4' },
    { nombre: 'Explorador',   min: 100, icon: '🧭', color: '#E0136C' },
    { nombre: 'Conocedor',    min: 300, icon: '🌟', color: '#F24D95' },
    { nombre: 'Embajador',    min: 600, icon: '🏛', color: '#FFD700' },
    { nombre: 'Leyenda Local',min: 1000,icon: '🔥', color: '#FF6B35' },
  ];

  // ── STORAGE ──
  const KEY = 'mercado360_user';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch { return null; }
  }

  function saveUser(u) {
    localStorage.setItem(KEY, JSON.stringify(u));
  }

  function createUser(nombre, email) {
    const u = {
      nombre, email,
      pts: 0,
      fotos: 0,
      resenas: [],
      misionesCompletadas: [],
      descuentos: [],
      fechaRegistro: new Date().toISOString(),
    };
    saveUser(u);
    // Guardar en ranking compartido (simulado en localStorage)
    addToRanking(u);
    return u;
  }

  function addToRanking(u) {
    try {
      const ranking = JSON.parse(localStorage.getItem('mercado360_ranking')) || [];
      const idx = ranking.findIndex(r => r.email === u.email);
      const entry = { nombre: u.nombre, email: u.email, pts: u.pts, nivel: getNivel(u.pts).nombre };
      if (idx >= 0) ranking[idx] = entry;
      else ranking.push(entry);
      ranking.sort((a, b) => b.pts - a.pts);
      localStorage.setItem('mercado360_ranking', JSON.stringify(ranking.slice(0, 20)));
    } catch {}
  }

  function getRanking() {
    try { return JSON.parse(localStorage.getItem('mercado360_ranking')) || []; }
    catch { return []; }
  }

  function getNivel(pts) {
    let nivel = NIVELES[0];
    for (const n of NIVELES) { if (pts >= n.min) nivel = n; }
    return nivel;
  }

  function getNivelSiguiente(pts) {
    for (const n of NIVELES) { if (pts < n.min) return n; }
    return null;
  }

  function checkMisiones(u) {
    const nuevas = [];
    for (const m of MISIONES) {
      if (u.misionesCompletadas.includes(m.id)) continue;
      let cumplida = false;
      if (m.tipo === 'foto' && m.meta && u.fotos >= m.meta) cumplida = true;
      if (m.tipo === 'foto' && !m.meta && u.fotos >= 1) cumplida = true;
      if (m.tipo === 'resena' && m.meta && u.resenas.length >= m.meta) cumplida = true;
      if (m.tipo === 'resena' && !m.meta && u.resenas.length >= 1) cumplida = true;
      if (m.tipo === 'combo' && u.fotos >= m.meta.foto && u.resenas.length >= m.meta.resena) cumplida = true;
      if (cumplida) {
        u.misionesCompletadas.push(m.id);
        u.pts += m.pts;
        if (m.recompensa) u.descuentos.push(m.recompensa);
        nuevas.push(m);
      }
    }
    return nuevas;
  }

  // ── HTML DE LA SECCIÓN ──
  function buildHTML() {
    return `
<section id="incentivos" class="reveal">
  <div class="inc-inner">
    <div class="inc-header">
      <p class="section-label"><i class="section-icon icon-lealtad"></i> Comunidad & Recompensas</p>
      <h2 class="section-title">Vive <em>Cosoleacaque</em></h2>
      <p class="inc-sub">Explora el mercado, comparte tus experiencias y gana recompensas reales en los puestos locales de Cosoleacaque.</p>
    </div>

    <!-- LOGIN -->
    <div class="inc-login-box" id="incLoginBox">
      <div class="inc-login-title">Únete al programa</div>
      <div class="inc-login-sub">Guarda tu progreso · Gana puntos · Desbloquea descuentos</div>
      <input class="inc-field" id="incNombre" type="text" placeholder="Tu nombre" maxlength="40">
      <input class="inc-field" id="incEmail"  type="email" placeholder="tu@correo.com" maxlength="80">
      <button class="inc-btn" id="incLoginBtn"> Registrarme / Entrar</button>
    </div>

    <!-- PERFIL -->
    <div class="inc-perfil" id="incPerfil">
      <div class="perfil-card">
        <div class="perfil-nivel-icon" id="pNivelIcon">🌱</div>
        <div class="perfil-nombre" id="pNombre">—</div>
        <div class="perfil-nivel-label" id="pNivelLabel">Visitante</div>
        <div class="perfil-pts" id="pPts">0</div>
        <div class="perfil-pts-label">puntos acumulados</div>
        <div class="perfil-barra-wrap">
          <div class="perfil-barra-label">
            <span id="pNivelActual">Nivel actual</span>
            <span id="pNivelSig">Siguiente nivel</span>
          </div>
          <div class="perfil-barra"><div class="perfil-barra-fill" id="pBarra" style="width:0%"></div></div>
        </div>
        <div class="perfil-stats">
          <div class="pstat"><div class="pstat-num" id="pFotos">0</div><div class="pstat-label">Fotos</div></div>
          <div class="pstat"><div class="pstat-num" id="pResenas">0</div><div class="pstat-label">Reseñas</div></div>
        </div>
      </div>
      <div class="perfil-card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(234,232,245,.25);margin-bottom:1rem;">Acciones rápidas</div>
          <button class="inc-btn" style="margin-bottom:.75rem;" onclick="INCENTIVOS.abrirFoto()">📸 Subir foto del mercado</button>
          <button class="inc-btn" style="background:#1a0a2e;border:1px solid rgba(224,19,108,.3);" onclick="INCENTIVOS.abrirResena()">✍️ Dejar reseña de un puesto</button>
        </div>
        <button class="inc-btn-ghost" id="incLogoutBtn">Cerrar sesión</button>
      </div>
    </div>

    <!-- TABS -->
    <div class="inc-tabs" id="incTabs" style="display:none">
      <button class="inc-tab active" data-tab="misiones">Misiones</button>
      <button class="inc-tab" data-tab="descuentos">Mis Descuentos</button>
      <button class="inc-tab" data-tab="ranking">Ranking</button>
    </div>

    <!-- PANEL MISIONES -->
    <div class="inc-panel active" id="tab-misiones">
      <div class="misiones-grid" id="misionesGrid"></div>
    </div>

    <!-- PANEL DESCUENTOS -->
    <div class="inc-panel" id="tab-descuentos">
      <div class="descuentos-lista" id="descuentosLista"></div>
    </div>

    <!-- PANEL RANKING -->
    <div class="inc-panel" id="tab-ranking">
      <div class="ranking-lista" id="rankingLista"></div>
    </div>
  </div>
</section>

<!-- MODAL FOTO -->
<div class="accion-modal" id="modalFoto">
  <div class="accion-box">
    <button class="accion-close" onclick="INCENTIVOS.cerrarModales()">✕</button>
    <div class="accion-titulo">📸 Subir foto</div>
    <div class="accion-sub">+50 pts por tu primera foto · +120 pts al llegar a 3</div>
    <div class="accion-upload-area" onclick="document.getElementById('fotoInput').click()">
      <div class="accion-upload-icon">🖼️</div>
      <div class="accion-upload-txt">Haz clic para seleccionar una imagen</div>
    </div>
    <input type="file" accept="image/*" class="accion-upload-input" id="fotoInput">
    <img id="fotoPreview" class="accion-preview" alt="preview">
    <select class="accion-select" id="fotoPuesto">
      <option value="">— ¿De qué lugar es la foto? (opcional) —</option>
      <option>Entrada Principal</option>
      <option>Tamales "Doña Lupe"</option>
      <option>Mariscos "Don Chago"</option>
      <option>Caldos "La Riverita"</option>
      <option>Dulcería Los Sabores</option>
      <option>Bordados Nahuas</option>
      <option>Petates Don Aurelio</option>
      <option>Otro lugar del mercado</option>
    </select>
    <button class="inc-btn" onclick="INCENTIVOS.enviarFoto()">✦ Publicar foto</button>
  </div>
</div>

<!-- MODAL RESEÑA -->
<div class="accion-modal" id="modalResena">
  <div class="accion-box">
    <button class="accion-close" onclick="INCENTIVOS.cerrarModales()">✕</button>
    <div class="accion-titulo">✍️ Dejar reseña</div>
    <div class="accion-sub">+40 pts por tu primera reseña · +100 pts al reseñar 3 puestos</div>
    <select class="accion-select" id="resenaPuesto">
      <option value="">— Selecciona el puesto —</option>
      <option>Tamales "Doña Lupe"</option>
      <option>Mariscos "Don Chago"</option>
      <option>Caldos "La Riverita"</option>
      <option>Dulcería Los Sabores</option>
      <option>Bordados Nahuas</option>
      <option>Petates Don Aurelio</option>
    </select>
    <div style="font-family:'DM Mono',monospace;font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(234,232,245,.25);margin-bottom:.4rem;">Calificación</div>
    <div class="accion-stars" id="estrellas">
      <button class="star-btn" data-v="1">⭐</button>
      <button class="star-btn" data-v="2">⭐</button>
      <button class="star-btn" data-v="3">⭐</button>
      <button class="star-btn" data-v="4">⭐</button>
      <button class="star-btn" data-v="5">⭐</button>
    </div>
    <textarea class="accion-textarea" id="resenaTexto" placeholder="Cuéntanos tu experiencia en el puesto…"></textarea>
    <button class="inc-btn" onclick="INCENTIVOS.enviarResena()">✦ Publicar reseña</button>
  </div>
</div>

<!-- TOAST -->
<div class="inc-toast" id="incToast"></div>
    `;
  }

  // ── RENDER ──
  function renderMisiones(u) {
    const grid = document.getElementById('misionesGrid');
    if (!grid) return;
    grid.innerHTML = MISIONES.map(m => {
      const done = u && u.misionesCompletadas.includes(m.id);
      let progreso = 0, meta = 1;
      if (u) {
        if (m.tipo === 'foto')   { meta = m.meta || 1; progreso = Math.min(u.fotos, meta); }
        if (m.tipo === 'resena') { meta = m.meta || 1; progreso = Math.min(u.resenas.length, meta); }
        if (m.tipo === 'combo')  { meta = m.meta.foto + m.meta.resena; progreso = Math.min(u.fotos, m.meta.foto) + Math.min(u.resenas.length, m.meta.resena); }
      }
      const pct = Math.round((progreso / meta) * 100);
      return `
        <div class="mision-card ${done ? 'completada' : ''}">
          <div class="mision-icon">${m.icon}</div>
          <div class="mision-titulo">${m.titulo}</div>
          <div class="mision-desc">${m.desc}</div>
          <div class="mision-footer">
            <div class="mision-pts"><span>${m.pts}</span> pts</div>
            ${m.recompensa ? `<div class="mision-recompensa">🎁 Descuento incluido</div>` : ''}
            ${!done && u ? `<button class="mision-accion" onclick="INCENTIVOS.${m.tipo === 'resena' ? 'abrirResena' : 'abrirFoto'}()">${m.tipo === 'resena' ? 'Reseñar' : 'Subir foto'}</button>` : ''}
          </div>
          ${(meta > 1) ? `<div class="mision-progress"><div class="mision-progress-fill" style="width:${pct}%"></div></div>` : ''}
        </div>`;
    }).join('');
  }

  function renderDescuentos(u) {
    const el = document.getElementById('descuentosLista');
    if (!el) return;
    if (!u || !u.descuentos.length) {
      el.innerHTML = '<div class="sin-descuentos">🎁<br>Completa misiones para desbloquear descuentos en los puestos del mercado.</div>';
      return;
    }
    el.innerHTML = u.descuentos.map(d => `
      <div class="descuento-card">
        <div class="descuento-emoji">🎟️</div>
        <div class="descuento-desc">${d.desc}</div>
        <div class="descuento-codigo" onclick="copiarCodigo('${d.codigo}')">${d.codigo}</div>
        <div class="descuento-copy-hint">Haz clic para copiar el código</div>
      </div>`).join('');
  }

  function renderRanking(u) {
    const el = document.getElementById('rankingLista');
    if (!el) return;
    const ranking = getRanking();
    if (!ranking.length) {
      el.innerHTML = '<div class="ranking-vacio">Aún no hay participantes. ¡Sé el primero!</div>';
      return;
    }
    el.innerHTML = ranking.map((r, i) => `
      <div class="ranking-row ${u && r.email === u.email ? 'yo' : ''}">
        <div class="ranking-pos ${i < 3 ? 'top' : ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
        <div>
          <div class="ranking-nombre">${r.nombre} ${u && r.email === u.email ? '<em style="color:#F24D95;font-size:.8em">(tú)</em>' : ''}</div>
          <div class="ranking-nivel">${r.nivel}</div>
        </div>
        <div class="ranking-pts">${r.pts} pts</div>
      </div>`).join('');
  }

  function renderPerfil(u) {
    const nivel     = getNivel(u.pts);
    const siguiente = getNivelSiguiente(u.pts);
    document.getElementById('pNivelIcon').textContent  = nivel.icon;
    document.getElementById('pNombre').textContent     = u.nombre;
    document.getElementById('pNivelLabel').textContent = nivel.nombre;
    document.getElementById('pPts').textContent        = u.pts;
    document.getElementById('pFotos').textContent      = u.fotos;
    document.getElementById('pResenas').textContent    = u.resenas.length;
    if (siguiente) {
      const pct = Math.round(((u.pts - nivel.min) / (siguiente.min - nivel.min)) * 100);
      document.getElementById('pBarra').style.width  = pct + '%';
      document.getElementById('pNivelActual').textContent = nivel.nombre;
      document.getElementById('pNivelSig').textContent    = siguiente.nombre + ' (' + siguiente.min + ' pts)';
    } else {
      document.getElementById('pBarra').style.width  = '100%';
      document.getElementById('pNivelActual').textContent = '¡Nivel máximo!';
      document.getElementById('pNivelSig').textContent    = '🔥 Leyenda Local';
    }
  }

  function showLogged(u) {
    document.getElementById('incLoginBox').style.display = 'none';
    document.getElementById('incPerfil').classList.add('visible');
    document.getElementById('incTabs').style.display    = 'flex';
    renderPerfil(u);
    renderMisiones(u);
    renderDescuentos(u);
    renderRanking(u);
  }

  function showLogout() {
    document.getElementById('incLoginBox').style.display = '';
    document.getElementById('incPerfil').classList.remove('visible');
    document.getElementById('incTabs').style.display    = 'none';
    renderMisiones(null);
  }

  // ── TOAST ──
  let toastT2;
  function toast(msg) {
    const t = document.getElementById('incToast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT2);
    toastT2 = setTimeout(() => t.classList.remove('show'), 3000);
  }

  window.copiarCodigo = function (cod) {
    navigator.clipboard.writeText(cod).then(() => toast('✓ Código copiado: ' + cod));
  };

  // ── ESTRELLA RATING ──
  let estrellaVal = 0;
  function initEstrellas() {
    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        estrellaVal = +btn.dataset.v;
        document.querySelectorAll('.star-btn').forEach(b => {
          b.classList.toggle('active', +b.dataset.v <= estrellaVal);
        });
      });
    });
  }

  // ── ACCIONES PÚBLICAS ──
  return {
    abrirFoto() { document.getElementById('modalFoto').classList.add('open'); },
    abrirResena() { document.getElementById('modalResena').classList.add('open'); },
    cerrarModales() {
      document.getElementById('modalFoto').classList.remove('open');
      document.getElementById('modalResena').classList.remove('open');
    },
    enviarFoto() {
      const u = getUser(); if (!u) { toast('Inicia sesión primero'); return; }
      const file = document.getElementById('fotoInput').files[0];
      if (!file) { toast('Selecciona una imagen'); return; }
      u.fotos++;
      const nuevas = checkMisiones(u);
      saveUser(u);
      addToRanking(u);
      renderPerfil(u);
      renderMisiones(u);
      renderDescuentos(u);
      renderRanking(u);
      this.cerrarModales();
      document.getElementById('fotoInput').value = '';
      document.getElementById('fotoPreview').style.display = 'none';
      if (nuevas.length) {
        nuevas.forEach(m => setTimeout(() => toast('🏆 Misión completada: ' + m.titulo + ' (+' + m.pts + ' pts)'), 300));
      } else {
        toast('📸 Foto subida · +progreso en misiones');
      }
    },
    enviarResena() {
      const u = getUser(); if (!u) { toast('Inicia sesión primero'); return; }
      const puesto = document.getElementById('resenaPuesto').value;
      const texto  = document.getElementById('resenaTexto').value.trim();
      if (!puesto) { toast('Selecciona un puesto'); return; }
      if (texto.length < 10) { toast('Escribe al menos 10 caracteres'); return; }
      if (estrellaVal === 0) { toast('Califica con estrellas'); return; }
      if (u.resenas.find(r => r.puesto === puesto)) { toast('Ya reseñaste este puesto'); return; }
      u.resenas.push({ puesto, texto, estrellas: estrellaVal, fecha: new Date().toISOString() });
      const nuevas = checkMisiones(u);
      saveUser(u);
      addToRanking(u);
      renderPerfil(u);
      renderMisiones(u);
      renderDescuentos(u);
      renderRanking(u);
      this.cerrarModales();
      document.getElementById('resenaPuesto').value = '';
      document.getElementById('resenaTexto').value  = '';
      estrellaVal = 0;
      document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      if (nuevas.length) {
        nuevas.forEach(m => setTimeout(() => toast('🏆 Misión completada: ' + m.titulo + ' (+' + m.pts + ' pts)'), 300));
      } else {
        toast('✍️ Reseña publicada · +progreso en misiones');
      }
    },
    init() {
      // Insertar sección en el anchor reservado, o antes del footer
      const anchor = document.getElementById('lealtad-anchor');
      const footer = document.querySelector('footer');
      const ref    = anchor || footer || document.body;
      const div    = document.createElement('div');
      div.innerHTML = buildHTML();
      const sec = div.firstElementChild;
      // Añadir id="lealtad" para que el enlace del nav funcione
      if (sec && !sec.id.includes('lealtad')) {
        sec.setAttribute('id', 'lealtad');
      } else if (sec) {
        // Asignar ambos ids via wrapper
        const wrapper = document.createElement('div');
        wrapper.id = 'lealtad';
        wrapper.appendChild(sec);
        div.appendChild(wrapper);
      }
      if (anchor) {
        anchor.parentNode.insertBefore(div.firstElementChild || sec, anchor.nextSibling);
        anchor.remove();
      } else {
        document.body.insertBefore(div.firstElementChild || sec, ref);
      }
      // Mover modales y toast al body
      div.querySelectorAll('.accion-modal, .inc-toast').forEach(el => document.body.appendChild(el));

      // Forzar visibilidad — la sección se inyecta dinámicamente,
      // el IntersectionObserver de main.js ya no la observa.
      // Usar la referencia directa a `sec` porque el id fue renombrado a 'lealtad'.
      if (sec) sec.classList.add('visible');

      initEstrellas();

      // Preview foto
      document.getElementById('fotoInput').addEventListener('change', function () {
        const f = this.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = e => {
          const img = document.getElementById('fotoPreview');
          img.src = e.target.result;
          img.style.display = 'block';
        };
        r.readAsDataURL(f);
      });

      // Tabs
      document.querySelectorAll('.inc-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.inc-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.inc-panel').forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
      });

      // Login
      document.getElementById('incLoginBtn').addEventListener('click', () => {
        const nombre = document.getElementById('incNombre').value.trim();
        const email  = document.getElementById('incEmail').value.trim();
        if (!nombre || nombre.length < 2) { toast('Ingresa tu nombre'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { toast('Email inválido'); return; }
        let u = getUser();
        if (u && u.email !== email) {
          // Otro email = nueva cuenta
          u = createUser(nombre, email);
        } else if (!u) {
          u = createUser(nombre, email);
        }
        showLogged(u);
        toast('✦ Bienvenido/a, ' + u.nombre);
      });

      // Logout
      document.getElementById('incLogoutBtn').addEventListener('click', () => {
        localStorage.removeItem(KEY);
        showLogout();
        toast('Sesión cerrada');
      });

      // Cerrar modales al hacer clic fuera
      ['modalFoto', 'modalResena'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
          if (e.target.id === id) this.cerrarModales();
        });
      });

      // Cargar sesión guardada
      const u = getUser();
      if (u) showLogged(u);
      else { renderMisiones(null); renderRanking(null); }
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => INCENTIVOS.init());