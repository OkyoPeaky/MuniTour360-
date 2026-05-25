// ════════════════════════════════════════════════════════
//
//  TOUR360.JS — A-Frame WebXR Tour
//  Compatible: Desktop, Mobile, Meta Quest 3
//  Cosoleacaque · Demo Rueda de la Fortuna
//
// ════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE TOURS
//  Para agregar escenas nuevas: solo agrega entradas aquí
// ════════════════════════════════════════════════════════
const TOURS = {

  rueda: {
    nombre: 'Parque & Rueda de la Fortuna',
    descripcion: 'Cultura y entretenimiento en el corazón de Cosoleacaque',
    escenaInicial: 'pos1',
    escenas: {

      // ── POSICIÓN 1 — Plaza de acceso (vista lateral de la rueda) ──
      'pos1': {
        nombre: 'Plaza de Acceso',
        descripcion: 'Vista panorámica de la explanada al atardecer, con la rueda como protagonista.',
        imagen: '#img-pos1',
        rotacionInicial: 169,
        inclinacionX: 12,
        inclinacionZ: -22,
        hotspots: [
          {
            // Acercarse a la rueda — hotspot al frente, sobre el piso
            to: 'pos2',
            position: { x: 0, y: -1.5, z: -3.5 },
            label: 'Acercarse a la rueda'
          },
          {
            // Acceder al video 360 de la rueda en movimiento
            to: 'video-rueda',
            position: { x: -2.5, y: -1, z: -2 },
            label: '▶ Ver la rueda en movimiento',
            tipo: 'video'  // estilo dorado en vez de rosa
          }
        ],
        infospots: []
      },

      // ── POSICIÓN 2 — Base de la rueda (vista frontal de la rueda) ──
      'pos2': {
        nombre: 'Base de la Rueda',
        descripcion: 'Al pie de la atracción, donde la estructura monumental impone su escala.',
        imagen: '#img-pos2',
        rotacionInicial: 163,
        inclinacionX: 9,
        inclinacionZ: 4,
        hotspots: [
          {
            // Volver a la plaza — hotspot atrás
            to: 'pos1',
            position: { x: 0, y: -1.5, z: 3.5 },
            label: 'Volver a la plaza'
          }
        ],
        infospots: []
      },

      // ── VIDEO 360 — Rueda en movimiento ──
      'video-rueda': {
        nombre: 'Rueda en Movimiento',
        descripcion: 'Vive la atracción en acción · Video inmersivo 360°',
        tipoEscena: 'video',           // ← tipo especial: video
        video: '#vid-rueda',
        rotacionInicial: 180,
        inclinacionX: 0,
        inclinacionZ: 0,
        regresarA: 'pos2',             // ← al terminar el video, vuelve aquí
        hotspots: []                   // sin hotspots: se usan los controles flotantes
      }

      // Para agregar más escenas (ej. Casa de Cultura), añade aquí:
      // 'casa-cultura-1': { ... }

    }
  }

  // Para agregar otros tours (ej. mercado), añade aquí:
  // mercado: { ... }
};


// ════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ════════════════════════════════════════════════════════
const state = {
  tourActual: 'rueda',
  escenaActual: null,
  enTransicion: false
};


// ════════════════════════════════════════════════════════
//  COMPONENTE A-FRAME: HOTSPOT (punto de navegación)
//  Renderiza un anillo en el suelo que al tocarlo cambia escena
// ════════════════════════════════════════════════════════
AFRAME.registerComponent('hotspot-nav', {
  schema: {
    target: { type: 'string' },
    label:  { type: 'string', default: '' },
    tipo:   { type: 'string', default: 'normal' }   // 'normal' (rosa) | 'video' (dorado)
  },

  init: function () {
    const el = this.el;
    const data = this.data;

    // Colores según tipo
    const esVideo = data.tipo === 'video';
    const colorPrincipal = esVideo ? '#D4A256' : '#E0136C';   // dorado o magenta
    const colorBrillo    = esVideo ? '#F5C97D' : '#F24D95';
    const colorInterior  = esVideo ? '#E0136C' : '#D4A256';   // contraste opuesto

    // ── HITBOX INVISIBLE ──
    // Disco DEBAJO del piso para no interferir con el render de los anillos.
    // Sigue siendo detectada por el raycaster del láser (que viene de arriba)
    const hitbox = document.createElement('a-entity');
    hitbox.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.9,
      segments: 24
    });
    hitbox.setAttribute('material', {
      shader: 'flat',
      color: '#ff00ff',
      transparent: true,
      opacity: 0.001,
      depthWrite: false
    });
    hitbox.setAttribute('rotation', '-90 0 0');
    hitbox.setAttribute('position', '0 -0.05 0');
    hitbox.classList.add('hotspot-hitbox');
    hitbox.classList.add('clickable');
    el.appendChild(hitbox);

    // Anillo brillante en el suelo (estilo Street View)
    const ring = document.createElement('a-entity');
    ring.setAttribute('geometry', {
      primitive: 'ring',
      radiusInner: 0.35,
      radiusOuter: 0.55,
      segmentsTheta: 64
    });
    ring.setAttribute('material', {
      color: colorPrincipal,
      emissive: colorBrillo,
      emissiveIntensity: 0.8,
      side: 'double',
      opacity: 0.95,
      transparent: true
    });
    ring.setAttribute('rotation', '-90 0 0');
    el.appendChild(ring);

    // Círculo interior pulsante
    const inner = document.createElement('a-entity');
    inner.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.32,
      segments: 32
    });
    inner.setAttribute('material', {
      color: colorInterior,
      opacity: 0.4,
      transparent: true,
      side: 'double'
    });
    inner.setAttribute('rotation', '-90 0 0');
    inner.setAttribute('position', '0 0.01 0');
    inner.setAttribute('animation', {
      property: 'material.opacity',
      from: 0.15,
      to: 0.55,
      dur: 1400,
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
    el.appendChild(inner);

    // Flecha apuntando hacia arriba (indicador)
    const arrow = document.createElement('a-entity');
    arrow.setAttribute('geometry', {
      primitive: 'cone',
      radiusBottom: 0.18,
      radiusTop: 0,
      height: 0.3,
      segmentsRadial: 16
    });
    arrow.setAttribute('material', {
      color: '#EAE8F5',
      emissive: '#EAE8F5',
      emissiveIntensity: 0.4
    });
    arrow.setAttribute('position', '0 0.5 0');
    arrow.setAttribute('animation', {
      property: 'position',
      from: '0 0.4 0',
      to: '0 0.7 0',
      dur: 1200,
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
    el.appendChild(arrow);

    // Label flotante
    if (data.label) {
      const labelBg = document.createElement('a-entity');
      labelBg.setAttribute('geometry', {
        primitive: 'plane',
        width: 2.2,
        height: 0.45
      });
      labelBg.setAttribute('material', {
        color: '#0D0512',
        opacity: 0.92,
        transparent: true
      });
      labelBg.setAttribute('position', '0 1.1 0');
      labelBg.setAttribute('look-at', '[camera]');

      const labelText = document.createElement('a-entity');
      labelText.setAttribute('text', {
        value: data.label.toUpperCase(),
        align: 'center',
        color: '#EAE8F5',
        width: 4,
        font: 'mozillavr',
        letterSpacing: 2
      });
      labelText.setAttribute('position', '0 0 0.01');
      labelBg.appendChild(labelText);
      el.appendChild(labelBg);
    }

    // Click handler (mouse + controles VR)
    el.classList.add('clickable');

    const handleClick = (evt) => {
      console.log('[Hotspot] Click detectado en:', data.target, evt.type);
      if (window.logVR) window.logVR(`CLICK ${evt.type} → ${data.target}`);
      if (state.enTransicion) {
        console.log('[Hotspot] Ignorado: en transición');
        return;
      }
      cambiarEscena(data.target);
    };

    // Evento click estándar (mouse + raycaster manual)
    el.addEventListener('click', handleClick);

    // Eventos específicos de mandos VR: cuando el láser apunta y se aprieta el trigger
    el.addEventListener('triggerdown', handleClick);
    el.addEventListener('selectstart', handleClick);

    // Hover effect (mouse + láser VR)
    const onHoverIn = () => {
      console.log('[Hotspot] Hover:', data.target);
      if (window.logVR) window.logVR(`HOVER → ${data.target}`);
      ring.setAttribute('material', 'emissiveIntensity', 1.8);
      ring.setAttribute('scale', '1.2 1.2 1.2');
      document.body.style.cursor = 'pointer';
    };
    const onHoverOut = () => {
      ring.setAttribute('material', 'emissiveIntensity', 0.8);
      ring.setAttribute('scale', '1 1 1');
      document.body.style.cursor = '';
    };

    el.addEventListener('mouseenter', onHoverIn);
    el.addEventListener('mouseleave', onHoverOut);
    el.addEventListener('raycaster-intersected', onHoverIn);
    el.addEventListener('raycaster-intersected-cleared', onHoverOut);

    // Propagar eventos del hitbox al hotspot principal
    hitbox.addEventListener('click', handleClick);
    hitbox.addEventListener('triggerdown', handleClick);
    hitbox.addEventListener('selectstart', handleClick);
    hitbox.addEventListener('raycaster-intersected', onHoverIn);
    hitbox.addEventListener('raycaster-intersected-cleared', onHoverOut);

    // También en el anillo visible
    ring.classList.add('clickable');
    ring.addEventListener('click', handleClick);
    ring.addEventListener('triggerdown', handleClick);
    ring.addEventListener('selectstart', handleClick);
  }
});


// ════════════════════════════════════════════════════════
//  COMPONENTE A-FRAME: INFOSPOT (punto de información)
// ════════════════════════════════════════════════════════
AFRAME.registerComponent('infospot', {
  schema: {
    title: { type: 'string', default: '' },
    text:  { type: 'string', default: '' }
  },

  init: function () {
    const el = this.el;
    const data = this.data;

    // Esfera dorada brillante
    const orb = document.createElement('a-entity');
    orb.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.12
    });
    orb.setAttribute('material', {
      color: '#D4A256',
      emissive: '#D4A256',
      emissiveIntensity: 0.8,
      metalness: 0.4,
      roughness: 0.3
    });
    orb.setAttribute('animation', {
      property: 'scale',
      from: '0.9 0.9 0.9',
      to: '1.15 1.15 1.15',
      dur: 1800,
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
    el.appendChild(orb);

    // Halo
    const halo = document.createElement('a-entity');
    halo.setAttribute('geometry', {
      primitive: 'ring',
      radiusInner: 0.18,
      radiusOuter: 0.26,
      segmentsTheta: 32
    });
    halo.setAttribute('material', {
      color: '#D4A256',
      opacity: 0.4,
      transparent: true,
      side: 'double'
    });
    halo.setAttribute('look-at', '[camera]');
    el.appendChild(halo);

    // Panel de info (oculto inicialmente)
    const panel = document.createElement('a-entity');
    panel.setAttribute('visible', false);
    panel.setAttribute('position', '0 0.6 0');
    panel.setAttribute('look-at', '[camera]');

    const panelBg = document.createElement('a-entity');
    panelBg.setAttribute('geometry', {
      primitive: 'plane',
      width: 2.8,
      height: 1.4
    });
    panelBg.setAttribute('material', {
      color: '#0D0512',
      opacity: 0.95,
      transparent: true
    });
    panel.appendChild(panelBg);

    const panelBorder = document.createElement('a-entity');
    panelBorder.setAttribute('geometry', {
      primitive: 'plane',
      width: 2.85,
      height: 1.45
    });
    panelBorder.setAttribute('material', {
      color: '#D4A256',
      opacity: 0.6,
      transparent: true,
      side: 'double'
    });
    panelBorder.setAttribute('position', '0 0 -0.01');
    panel.appendChild(panelBorder);

    if (data.title) {
      const titleText = document.createElement('a-entity');
      titleText.setAttribute('text', {
        value: data.title,
        align: 'center',
        color: '#F24D95',
        width: 4,
        font: 'mozillavr',
        wrapCount: 22
      });
      titleText.setAttribute('position', '0 0.4 0.01');
      panel.appendChild(titleText);
    }

    if (data.text) {
      const bodyText = document.createElement('a-entity');
      bodyText.setAttribute('text', {
        value: data.text,
        align: 'center',
        color: '#EAE8F5',
        width: 3.2,
        font: 'mozillavr',
        wrapCount: 40
      });
      bodyText.setAttribute('position', '0 -0.1 0.01');
      panel.appendChild(bodyText);
    }

    el.appendChild(panel);

    // Toggle panel al hacer click
    el.classList.add('clickable');
    let isOpen = false;
    el.addEventListener('click', () => {
      isOpen = !isOpen;
      panel.setAttribute('visible', isOpen);
    });
  }
});


// ════════════════════════════════════════════════════════
//  COMPONENTE A-FRAME: LOOK-AT (mira hacia la cámara)
// ════════════════════════════════════════════════════════
AFRAME.registerComponent('look-at', {
  schema: { type: 'selector' },
  tick: function () {
    if (!this.data) return;
    const target = this.data.object3D.position;
    this.el.object3D.lookAt(target);
  }
});


// ════════════════════════════════════════════════════════
//  CARGAR ESCENA
// ════════════════════════════════════════════════════════
function cargarEscena(escenaId) {
  const tour = TOURS[state.tourActual];
  const escena = tour.escenas[escenaId];
  if (!escena) {
    console.error(`Escena no encontrada: ${escenaId}`);
    return;
  }

  state.escenaActual = escenaId;
  state.escenaConfig = escena;

  const sky        = document.getElementById('sky');
  const videosky   = document.getElementById('videosky');
  const videoCtrl  = document.getElementById('video-controls');
  const esVideo    = escena.tipoEscena === 'video';

  // ─── ESCENA DE VIDEO ───────────────────────────────────
  if (esVideo) {
    console.log('[Escena] Cargando video:', escena.video);

    // Recordar la escena previa para volver al terminar
    // (solo si veníamos de una escena que NO era video)
    const escenaPrev = state.escenaAnterior;
    if (escenaPrev && tour.escenas[escenaPrev] && tour.escenas[escenaPrev].tipoEscena !== 'video') {
      state.regresarA = escenaPrev;
    } else {
      state.regresarA = escena.regresarA || 'pos1';
    }
    console.log('[Video] Al terminar regresará a:', state.regresarA);

    // Ocultar el sky de imagen
    sky.setAttribute('visible', false);

    // Mostrar el videosphere
    videosky.setAttribute('visible', true);
    videosky.setAttribute('src', escena.video);
    videosky.setAttribute('rotation', `${escena.inclinacionX || 0} ${escena.rotacionInicial || 0} ${escena.inclinacionZ || 0}`);

    // Mostrar controles flotantes
    videoCtrl.setAttribute('visible', true);

    // Configurar y reproducir el video
    const videoEl = document.querySelector(escena.video);
    if (videoEl) {
      videoEl.loop = false;
      videoEl.muted = false;
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise) {
        playPromise.catch(err => {
          console.warn('Autoplay bloqueado, intentando muted:', err);
          videoEl.muted = true;
          videoEl.play().catch(e => console.error('No se pudo reproducir:', e));
        });
      }
      actualizarIconoPlayPause(true);
    }

  // ─── ESCENA DE FOTO (comportamiento original) ──────────
  } else {
    // Ocultar videosphere y controles
    videosky.setAttribute('visible', false);
    videoCtrl.setAttribute('visible', false);
    const videoEl = document.querySelector('#vid-rueda');
    if (videoEl) videoEl.pause();

    // Mostrar sky de imagen
    sky.setAttribute('visible', true);

    // Cargar imagen (igual que antes)
    if (escena.imagen && escena.imagen.startsWith('#')) {
      const assetImg = document.querySelector(escena.imagen);
      if (assetImg && assetImg.complete && assetImg.naturalWidth > 0) {
        sky.setAttribute('src', escena.imagen);
      } else if (assetImg) {
        console.log(`Esperando carga de ${escena.imagen}...`);
        assetImg.addEventListener('load', () => {
          sky.setAttribute('src', escena.imagen);
        }, { once: true });
        assetImg.addEventListener('error', (e) => {
          console.error(`Error cargando ${escena.imagen}:`, e);
          toast('Error cargando la imagen 360°');
        }, { once: true });
      } else {
        console.error(`Asset no encontrado: ${escena.imagen}`);
      }
    } else if (escena.imagen) {
      sky.setAttribute('src', escena.imagen);
    }

    sky.setAttribute('rotation', `${escena.inclinacionX || 0} ${escena.rotacionInicial || 0} ${escena.inclinacionZ || 0}`);
  }

  // Limpiar hotspots/infospots anteriores
  const container = document.getElementById('spots');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Crear hotspots de navegación (con soporte para tipo)
  (escena.hotspots || []).forEach(hs => {
    const spot = document.createElement('a-entity');
    spot.setAttribute('position', `${hs.position.x} ${hs.position.y} ${hs.position.z}`);
    const tipo = hs.tipo || 'normal';
    spot.setAttribute('hotspot-nav', `target: ${hs.to}; label: ${hs.label}; tipo: ${tipo}`);
    container.appendChild(spot);
  });

  // Crear infospots
  (escena.infospots || []).forEach(is => {
    const spot = document.createElement('a-entity');
    spot.setAttribute('position', `${is.position.x} ${is.position.y} ${is.position.z}`);
    spot.setAttribute('infospot', `title: ${is.title}; text: ${is.text}`);
    container.appendChild(spot);
  });

  // Actualizar UI
  document.getElementById('scene-title').textContent = escena.nombre;
  document.getElementById('scene-desc').textContent = escena.descripcion;

  // Contador de escenas: solo cuenta escenas de foto (no videos)
  const escenasFoto = Object.keys(tour.escenas).filter(k => tour.escenas[k].tipoEscena !== 'video');
  const indiceFoto = escenasFoto.indexOf(escenaId);
  document.getElementById('scene-num').textContent =
    esVideo ? '▶ Video 360°' : `Escena ${indiceFoto + 1} / ${escenasFoto.length}`;

  // Actualizar minimapa
  document.querySelectorAll('.mm-node').forEach(node => {
    node.classList.toggle('active', node.dataset.escena === escenaId);
  });
}


// ════════════════════════════════════════════════════════
//  CAMBIAR ESCENA (con transición fade)
// ════════════════════════════════════════════════════════
function cambiarEscena(escenaId) {
  if (state.enTransicion || escenaId === state.escenaActual) return;
  state.enTransicion = true;

  // Guardar la escena de la que venimos (para volver del video)
  state.escenaAnterior = state.escenaActual;

  // Fade HTML (visible en desktop/móvil fuera de VR)
  const fadeHTML = document.getElementById('fade');
  fadeHTML.classList.add('show');

  // Fade 3D (visible dentro de la escena, también funciona en VR)
  const fade3d = document.getElementById('fade3d');
  fade3d.setAttribute('visible', true);
  fade3d.setAttribute('animation__fadein', {
    property: 'material.opacity',
    from: 0,
    to: 1,
    dur: 500,
    easing: 'easeInQuad'
  });

  setTimeout(() => {
    // En negro total: cargar la nueva escena
    cargarEscena(escenaId);

    setTimeout(() => {
      // Quitar fade HTML
      fadeHTML.classList.remove('show');

      // Animar fade 3D de regreso a transparente
      fade3d.removeAttribute('animation__fadein');
      fade3d.setAttribute('animation__fadeout', {
        property: 'material.opacity',
        from: 1,
        to: 0,
        dur: 500,
        easing: 'easeOutQuad'
      });

      // Cuando termine la animación, ocultar la esfera
      setTimeout(() => {
        fade3d.setAttribute('visible', false);
        fade3d.removeAttribute('animation__fadeout');
        state.enTransicion = false;
      }, 550);
    }, 200);
  }, 500);
}


// ════════════════════════════════════════════════════════
//  CONSTRUIR MINIMAPA
// ════════════════════════════════════════════════════════
function construirMinimapa() {
  const tour = TOURS[state.tourActual];
  const minimap = document.getElementById('minimap');

  // Limpiar
  const existing = minimap.querySelectorAll('.mm-node');
  existing.forEach(n => n.remove());

  // Crear nodos (excluyendo escenas de video — solo se acceden por hotspot)
  Object.keys(tour.escenas).forEach(escenaId => {
    const escena = tour.escenas[escenaId];
    if (escena.tipoEscena === 'video') return;  // skip videos

    const node = document.createElement('div');
    node.className = 'mm-node';
    node.dataset.escena = escenaId;
    node.innerHTML = `
      <span class="mm-dot"></span>
      <span>${escena.nombre}</span>
    `;
    node.addEventListener('click', () => cambiarEscena(escenaId));
    minimap.appendChild(node);
  });
}


// ════════════════════════════════════════════════════════
//  TOAST de notificación
// ════════════════════════════════════════════════════════
function toast(mensaje, duracion = 2500) {
  const t = document.getElementById('toast');
  t.textContent = mensaje;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duracion);
}


// ════════════════════════════════════════════════════════
//  CONTROLES DE VIDEO 360
//  Play/Pause, Volver, barra de progreso, auto-regreso
// ════════════════════════════════════════════════════════

function actualizarIconoPlayPause(reproduciendo) {
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  if (!iconPlay || !iconPause) return;
  iconPlay.setAttribute('visible', !reproduciendo);
  iconPause.setAttribute('visible', reproduciendo);
}

function togglePlayPause() {
  const videoEl = document.querySelector('#vid-rueda');
  if (!videoEl) return;
  if (videoEl.paused) {
    videoEl.play();
    actualizarIconoPlayPause(true);
    toast('▶ Reproduciendo', 1500);
  } else {
    videoEl.pause();
    actualizarIconoPlayPause(false);
    toast('⏸ Pausa', 1500);
  }
}

function volverDeVideo() {
  const videoEl = document.querySelector('#vid-rueda');
  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }
  const destino = state.regresarA || 'pos1';
  console.log('[Video] Regresando a:', destino);
  cambiarEscena(destino);
}

function initControlesVideo() {
  const btnPlayPause = document.getElementById('btn-playpause');
  const btnBack      = document.getElementById('btn-back');
  const videoEl      = document.querySelector('#vid-rueda');

  // Helper: propaga eventos de cualquier hijo clickable al botón padre
  function aplicarHandlers(botonEl, accion) {
    if (!botonEl) return;

    const onAccion = (evt) => {
      console.log('[VideoBtn] Activado:', evt.type);
      accion();
    };
    const onIn = () => {
      botonEl.setAttribute('scale', '1.15 1.15 1.15');
      document.body.style.cursor = 'pointer';
    };
    const onOut = () => {
      botonEl.setAttribute('scale', '1 1 1');
      document.body.style.cursor = '';
    };

    // Eventos en el botón padre
    botonEl.addEventListener('click', onAccion);
    botonEl.addEventListener('triggerdown', onAccion);
    botonEl.addEventListener('selectstart', onAccion);
    botonEl.addEventListener('mouseenter', onIn);
    botonEl.addEventListener('mouseleave', onOut);
    botonEl.addEventListener('raycaster-intersected', onIn);
    botonEl.addEventListener('raycaster-intersected-cleared', onOut);

    // Propagar desde TODOS los hijos clickables (hitbox, círculo, etc.)
    botonEl.querySelectorAll('.clickable').forEach(hijo => {
      hijo.addEventListener('click', onAccion);
      hijo.addEventListener('triggerdown', onAccion);
      hijo.addEventListener('selectstart', onAccion);
      hijo.addEventListener('raycaster-intersected', onIn);
      hijo.addEventListener('raycaster-intersected-cleared', onOut);
    });
  }

  aplicarHandlers(btnPlayPause, togglePlayPause);
  aplicarHandlers(btnBack, volverDeVideo);

  if (videoEl) {
    // Cuando el video termina: volver automáticamente a la escena anterior
    videoEl.addEventListener('ended', () => {
      console.log('[Video] Terminó, regresando...');
      toast('✓ Video terminado · Regresando', 2000);
      setTimeout(volverDeVideo, 400);
    });

    // Actualizar barra de progreso
    videoEl.addEventListener('timeupdate', () => {
      const fill = document.getElementById('progress-fill');
      if (!fill || !videoEl.duration) return;
      const ratio = videoEl.currentTime / videoEl.duration;
      const totalWidth = 2.6;
      const width = totalWidth * ratio;
      fill.setAttribute('width', width);
      // Reposicionar para que crezca desde la izquierda
      fill.setAttribute('position', `${-totalWidth/2 + width/2} 0 0.001`);
    });

    // Cambiar ícono si el video se pausa/reproduce por causas externas
    videoEl.addEventListener('play',  () => actualizarIconoPlayPause(true));
    videoEl.addEventListener('pause', () => actualizarIconoPlayPause(false));

    // Loading toast cuando el video está buffereando
    videoEl.addEventListener('waiting', () => {
      toast('⌛ Cargando video…', 2000);
    });
  }

  console.log('[Video] Controles inicializados');
}


// ════════════════════════════════════════════════════════
//  SISTEMA DE CLICKS POR RAYCAST MANUAL (desktop/móvil)
//  Detecta clicks del mouse en hotspots de forma independiente
//  de look-controls. En VR, los hotspots usan eventos nativos.
// ════════════════════════════════════════════════════════
function initRaycastManual() {
  const scene = document.querySelector('a-scene');
  const canvas = scene.canvas;
  if (!canvas) {
    console.warn('[Raycast] Canvas no encontrado, reintentando...');
    setTimeout(initRaycastManual, 300);
    return;
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let mouseDownPos = null;
  let mouseDownTime = 0;

  // Capturamos mousedown para saber si es un click o un drag
  canvas.addEventListener('mousedown', (evt) => {
    mouseDownPos = { x: evt.clientX, y: evt.clientY };
    mouseDownTime = Date.now();
  });

  // Cuando suelta el mouse: si apenas se movió, lo consideramos click
  canvas.addEventListener('mouseup', (evt) => {
    if (!mouseDownPos) return;

    const dx = Math.abs(evt.clientX - mouseDownPos.x);
    const dy = Math.abs(evt.clientY - mouseDownPos.y);
    const dt = Date.now() - mouseDownTime;
    mouseDownPos = null;

    // Si se movió mucho o tardó demasiado, fue un drag, no un click
    if (dx > 5 || dy > 5 || dt > 500) {
      console.log('[Raycast] Fue drag, no click');
      return;
    }

    // Calcular coordenadas normalizadas (-1 a +1) desde el mouse
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast desde la cámara
    const camera = scene.camera;
    raycaster.setFromCamera(mouse, camera);

    // Buscar todos los elementos con clase 'clickable'
    const clickables = [];
    scene.querySelectorAll('.clickable').forEach(el => {
      el.object3D.traverse(obj => {
        if (obj.isMesh) {
          obj.userData.aframeEl = el;
          clickables.push(obj);
        }
      });
    });

    const hits = raycaster.intersectObjects(clickables, false);
    console.log(`[Raycast] Click en (${mouse.x.toFixed(2)}, ${mouse.y.toFixed(2)}) → ${hits.length} hits`);

    if (hits.length > 0) {
      const hitEl = hits[0].object.userData.aframeEl;
      if (hitEl) {
        console.log('[Raycast] Disparando click en:', hitEl);
        // Disparar evento click sintético
        hitEl.emit('click', { detail: { fromRaycast: true } });
      }
    }
  });

  // También manejar hover para cambiar cursor del navegador
  let hoveringEl = null;
  canvas.addEventListener('mousemove', (evt) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

    const camera = scene.camera;
    if (!camera) return;
    raycaster.setFromCamera(mouse, camera);

    const clickables = [];
    scene.querySelectorAll('.clickable').forEach(el => {
      el.object3D.traverse(obj => {
        if (obj.isMesh) {
          obj.userData.aframeEl = el;
          clickables.push(obj);
        }
      });
    });

    const hits = raycaster.intersectObjects(clickables, false);
    const newHover = hits.length > 0 ? hits[0].object.userData.aframeEl : null;

    if (newHover !== hoveringEl) {
      if (hoveringEl) hoveringEl.emit('mouseleave');
      if (newHover) {
        newHover.emit('mouseenter');
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = '';
      }
      hoveringEl = newHover;
    }
  });

  console.log('[Raycast] Sistema de raycast manual activado');
}


// ════════════════════════════════════════════════════════
//  INICIALIZACIÓN
// ════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Construir UI
  construirMinimapa();

  // Cargar escena inicial cuando la escena A-Frame esté lista
  const scene = document.querySelector('a-scene');

  const iniciar = () => {
    const tour = TOURS[state.tourActual];

    // Esperar a que los assets de A-Frame terminen de cargar
    const assets = document.querySelector('a-assets');

    const arrancarTour = () => {
      console.log('Assets listos, iniciando tour...');
      cargarEscena(tour.escenaInicial);

      // Activar sistema de raycast manual para clicks confiables
      setTimeout(initRaycastManual, 500);

      // Inicializar controles del video 360
      setTimeout(initControlesVideo, 600);

      // Ocultar pantalla de carga
      setTimeout(() => {
        document.getElementById('boot').classList.add('gone');
        setTimeout(() => {
          toast('Arrastra para mirar · Haz clic en los círculos para avanzar', 4000);
        }, 800);
      }, 500);
    };

    if (assets && !assets.hasLoaded) {
      console.log('Esperando assets...');
      assets.addEventListener('loaded', arrancarTour, { once: true });
      // Fallback: si tarda demasiado, arrancar de todas formas
      setTimeout(() => {
        if (!state.escenaActual) {
          console.warn('Timeout esperando assets, arrancando de todas formas');
          arrancarTour();
        }
      }, 15000);
    } else {
      arrancarTour();
    }
  };

  if (scene.hasLoaded) {
    iniciar();
  } else {
    scene.addEventListener('loaded', iniciar);
  }

  // Eventos VR/XR
  scene.addEventListener('enter-vr', () => {
    toast('Modo VR activo · Apunta y dispara para navegar', 3500);
    // Ocultar panel de ajuste en VR
    const panel = document.getElementById('tilt-panel');
    if (panel) panel.style.display = 'none';
  });

  scene.addEventListener('exit-vr', () => {
    toast('Saliste del modo VR', 2000);
    const panel = document.getElementById('tilt-panel');
    if (panel) panel.style.display = 'block';
  });

  // Inicializar panel de ajuste de inclinación
  initTiltPanel();
});


// ════════════════════════════════════════════════════════
//  Helper: logVR stub (debug panel desactivado)
// ════════════════════════════════════════════════════════
window.logVR = function() {};


// ════════════════════════════════════════════════════════
//  PANEL DE AJUSTE DE INCLINACIÓN (modo desarrollo)
//  Permite tantear los valores correctos en vivo
//  Cuando termines, copia los valores y ponlos en TOURS
// ════════════════════════════════════════════════════════
