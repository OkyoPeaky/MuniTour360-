// ════════════════════════════════════════════════════════
//
//  MERCADO360.JS — Experiencia 360° Cosoleacaque
//  Incluye: Carrusel selector de destinos + Visor Street View
//
// ════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════
//  DESTINOS — Cada destino tiene su propio grafo de nodos
// ════════════════════════════════════════════════════════
const DESTINOS = [
  {
    id: 'mercado',
    nombre: 'Mercado Municipal',
    tag: '🏪 Comercio & Gastronomía',
    desc: 'Sabores, aromas y artesanías del sur veracruzano en un solo lugar.',
    imagen: 'mercado.webp',  // ← Sube un nivel con ../
    colorBg: '#3d1a00',
    tieneCompras: true,
    primerNodo: 'entrada-principal',
  },
  {
    id: 'parque',
    nombre: 'Parque Central',
    tag: '🌳 Espacio Público',
    desc: 'El corazón verde de Cosoleacaque, donde la vida cotidiana cobra vida.',
    imagen: 'Parque.jpg',
    colorBg: '#0a1f0a',
    tieneCompras: false,
    primerNodo: 'parque-entrada',
  },
  {
    id: 'choca',
    nombre: 'Centro Deportivo La Choca',
    tag: '⚽ Deporte & Recreación',
    desc: 'El epicentro deportivo del municipio, hogar de campeones locales.',
    imagen: 'choca.jpg',
    colorBg: '#001a3d',
    tieneCompras: false,
    primerNodo: 'choca-entrada',
  },
  {
    id: 'rueda',
    nombre: 'Parque & Casa Cultural',
    tag: '🎡 Cultura & Entretenimiento',
    desc: 'Rueda de la fortuna, feria y vida cultural en el mismo espacio.',
    imagen: 'Rueda.png',
    colorBg: '#1a0a3d',
    tieneCompras: false,
    primerNodo: 'rueda-entrada',
    tourVR: 'tour360.html',  // ← Tour A-Frame disponible (Quest 3 compatible)
  },
  {
    id: 'iglesia',
    nombre: 'Parroquia San Juan Bautista',
    tag: '⛪ Patrimonio & Fe',
    desc: 'Arquitectura colonial y devoción popular en el centro histórico.',
    imagen: 'Iglesia fuera.jpg',
    colorBg: '#1a0a00',
    tieneCompras: false,
    primerNodo: 'iglesia-entrada',
  },
];

// ════════════════════════════════════════════════════════
//  GRAFOS DE NODOS POR DESTINO
// ════════════════════════════════════════════════════════

// ── MERCADO ──
const NODES_MERCADO = {
  'entrada-principal': {
    nombre: 'Entrada Principal', emoji: '🚪',
    // imagePath: 'fotos/mercado/nodo_01.jpg',
    bgColor: 0x3d2200, fogColor: 0x1a0a00, startLon: 0,
    connections: [
      { to: 'pasillo-a1',  lon:  5,   lat: -42, label: 'Entrar al pasillo A' },
      { to: 'caseta-info', lon: -70,  lat: -38, label: 'Caseta de información' },
    ],
    hotspots: [{ id: 'bienvenida', lon: -10, lat: -5 }]
  },
  'caseta-info': {
    nombre: 'Caseta de Información', emoji: 'ℹ️',
    bgColor: 0x2a1800, fogColor: 0x100800, startLon: 90,
    connections: [
      { to: 'entrada-principal', lon: 180, lat: -40, label: 'Volver a entrada' },
      { to: 'pasillo-a1',        lon:  10, lat: -38, label: 'Pasillo A' },
    ],
    hotspots: [{ id: 'bienvenida', lon: 30, lat: -8 }]
  },
  'pasillo-a1': {
    nombre: 'Pasillo A — Norte', emoji: '🏪',
    bgColor: 0x4a2800, fogColor: 0x1a0d00, startLon: 0,
    connections: [
      { to: 'entrada-principal', lon: 180, lat: -40, label: 'Volver a entrada' },
      { to: 'pasillo-a2',        lon:   0, lat: -42, label: 'Avanzar por pasillo A' },
      { to: 'pasillo-b1',        lon:  90, lat: -38, label: 'Cruzar a pasillo B' },
    ],
    hotspots: [{ id: 'tamales', lon: -40, lat: -8 }]
  },
  'pasillo-a2': {
    nombre: 'Pasillo A — Centro', emoji: '🏬',
    bgColor: 0x4a2200, fogColor: 0x1a0900, startLon: 0,
    connections: [
      { to: 'pasillo-a1', lon: 180, lat: -40, label: 'Volver al norte' },
      { to: 'pasillo-a3', lon:   0, lat: -42, label: 'Seguir al sur' },
      { to: 'pasillo-b2', lon:  90, lat: -38, label: 'Cruzar a pasillo B' },
    ],
    hotspots: [{ id: 'mariscos', lon: 45, lat: -10 }]
  },
  'pasillo-a3': {
    nombre: 'Pasillo A — Sur', emoji: '🍲',
    bgColor: 0x5c1500, fogColor: 0x200500, startLon: 0,
    connections: [
      { to: 'pasillo-a2',       lon: 180, lat: -40, label: 'Volver al centro' },
      { to: 'zona-gastronomia', lon:   0, lat: -42, label: 'Zona gastronómica' },
    ],
    hotspots: [
      { id: 'caldos', lon: -35, lat: -8 },
      { id: 'dulces', lon:  55, lat: -8 },
    ]
  },
  'zona-gastronomia': {
    nombre: 'Zona Gastronómica', emoji: '🍽️',
    bgColor: 0x6a1200, fogColor: 0x280400, startLon: 0,
    connections: [
      { to: 'pasillo-a3', lon: 180, lat: -40, label: 'Volver al pasillo A' },
      { to: 'pasillo-b3', lon:  90, lat: -38, label: 'Pasillo B' },
    ],
    hotspots: [
      { id: 'caldos', lon: -20, lat: -8 },
      { id: 'dulces', lon:  50, lat: -8 },
    ]
  },
  'pasillo-b1': {
    nombre: 'Pasillo B — Norte', emoji: '🧵',
    bgColor: 0x1a1050, fogColor: 0x0a0820, startLon: -90,
    connections: [
      { to: 'pasillo-a1', lon: -90, lat: -38, label: 'Cruzar a pasillo A' },
      { to: 'pasillo-b2', lon:   0, lat: -42, label: 'Avanzar por pasillo B' },
    ],
    hotspots: [{ id: 'bordados', lon: 40, lat: -8 }]
  },
  'pasillo-b2': {
    nombre: 'Pasillo B — Centro', emoji: '🌴',
    bgColor: 0x1a1545, fogColor: 0x08061a, startLon: -90,
    connections: [
      { to: 'pasillo-b1', lon: 180, lat: -40, label: 'Volver al norte' },
      { to: 'pasillo-b3', lon:   0, lat: -42, label: 'Seguir al sur' },
      { to: 'pasillo-a2', lon: -90, lat: -38, label: 'Cruzar a pasillo A' },
    ],
    hotspots: [{ id: 'petate', lon: -45, lat: -8 }]
  },
  'pasillo-b3': {
    nombre: 'Pasillo B — Sur', emoji: '🎨',
    bgColor: 0x150e3f, fogColor: 0x060418, startLon: -90,
    connections: [
      { to: 'pasillo-b2',       lon: 180, lat: -40, label: 'Volver al centro' },
      { to: 'zona-gastronomia', lon: -90, lat: -38, label: 'Zona gastronómica' },
    ],
    hotspots: [
      { id: 'bordados', lon:  30, lat: -8 },
      { id: 'petate',   lon: -40, lat: -8 },
    ]
  },
};

// ── PARQUE CENTRAL ──
const NODES_PARQUE = {
  'parque-entrada': {
    nombre: 'Entrada al Parque', emoji: '🌳',
    // imagePath: 'fotos/parque/nodo_01.jpg',
    bgColor: 0x0a2a0a, fogColor: 0x041004, startLon: 0,
    connections: [
      { to: 'parque-kiosco',   lon:   0, lat: -42, label: 'Ir al kiosco' },
      { to: 'parque-fuente',   lon:  80, lat: -38, label: 'Ver la fuente' },
    ],
    hotspots: [{ id: 'parque-info', lon: -20, lat: -8 }]
  },
  'parque-kiosco': {
    nombre: 'Kiosco Central', emoji: '🎵',
    bgColor: 0x0d2e0d, fogColor: 0x061606, startLon: 0,
    connections: [
      { to: 'parque-entrada',  lon: 180, lat: -40, label: 'Volver a la entrada' },
      { to: 'parque-fuente',   lon:  90, lat: -38, label: 'Ir a la fuente' },
      { to: 'parque-andador',  lon:   0, lat: -42, label: 'Recorrer andador' },
    ],
    hotspots: [{ id: 'kiosco-cultural', lon: 15, lat: -5 }]
  },
  'parque-fuente': {
    nombre: 'Fuente y Jardines', emoji: '💧',
    bgColor: 0x0a1f1f, fogColor: 0x040e0e, startLon: -45,
    connections: [
      { to: 'parque-entrada',  lon: -90, lat: -38, label: 'Entrada al parque' },
      { to: 'parque-kiosco',   lon: -90, lat: -40, label: 'Kiosco central' },
    ],
    hotspots: [{ id: 'parque-info', lon: 30, lat: -8 }]
  },
  'parque-andador': {
    nombre: 'Andador Principal', emoji: '🚶',
    bgColor: 0x0f2a0f, fogColor: 0x061206, startLon: 0,
    connections: [
      { to: 'parque-kiosco',   lon: 180, lat: -40, label: 'Volver al kiosco' },
      { to: 'parque-salida',   lon:   0, lat: -42, label: 'Salida del parque' },
    ],
    hotspots: []
  },
  'parque-salida': {
    nombre: 'Salida Norte', emoji: '🚪',
    bgColor: 0x122a12, fogColor: 0x071207, startLon: 0,
    connections: [
      { to: 'parque-andador',  lon: 180, lat: -40, label: 'Volver al andador' },
    ],
    hotspots: []
  },
};

// ── LA CHOCA ──
const NODES_CHOCA = {
  'choca-entrada': {
    nombre: 'Acceso Principal', emoji: '🏟️',
    // imagePath: 'nodo_01.jpg',
    bgColor: 0x00173d, fogColor: 0x000a1a, startLon: 0,
    connections: [
      { to: 'choca-cancha',    lon:   0, lat: -42, label: 'Cancha principal' },
      { to: 'choca-vestidor',  lon:  80, lat: -38, label: 'Vestidores' },
    ],
    hotspots: [{ id: 'choca-info', lon: -15, lat: -8 }]
  },
  'choca-cancha': {
    nombre: 'Cancha Principal', emoji: '⚽',
    bgColor: 0x001a10, fogColor: 0x000a08, startLon: 0,
    connections: [
      { to: 'choca-entrada',   lon: 180, lat: -40, label: 'Volver al acceso' },
      { to: 'choca-gradas',    lon:  90, lat: -38, label: 'Gradas' },
      { to: 'choca-pista',     lon:   0, lat: -42, label: 'Pista de atletismo' },
    ],
    hotspots: [{ id: 'choca-actividades', lon: 25, lat: -8 }]
  },
  'choca-gradas': {
    nombre: 'Gradas', emoji: '🪑',
    bgColor: 0x001533, fogColor: 0x00091a, startLon: -90,
    connections: [
      { to: 'choca-cancha',    lon: -90, lat: -38, label: 'Bajar a la cancha' },
    ],
    hotspots: []
  },
  'choca-pista': {
    nombre: 'Pista de Atletismo', emoji: '🏃',
    bgColor: 0x1a0a00, fogColor: 0x0a0500, startLon: 0,
    connections: [
      { to: 'choca-cancha',    lon: 180, lat: -40, label: 'Volver a la cancha' },
      { to: 'choca-vestidor',  lon:  90, lat: -38, label: 'Vestidores' },
    ],
    hotspots: []
  },
  'choca-vestidor': {
    nombre: 'Área de Vestidores', emoji: '🚿',
    bgColor: 0x001520, fogColor: 0x000810, startLon: 90,
    connections: [
      { to: 'choca-entrada',   lon: -90, lat: -38, label: 'Acceso principal' },
      { to: 'choca-pista',     lon: -90, lat: -40, label: 'Pista de atletismo' },
    ],
    hotspots: []
  },
};

// ── PARQUE RUEDA / CASA CULTURAL ──
const NODES_RUEDA = {
  'rueda-entrada': {
    nombre: 'Entrada a la Feria', emoji: '🎡',
    // imagePath: 'nodo_01.jpg',
    bgColor: 0x1a0040, fogColor: 0x0a0020, startLon: 0,
    connections: [
      { to: 'rueda-principal', lon:   0, lat: -42, label: 'Rueda de la fortuna' },
      { to: 'casa-cultural',   lon: -70, lat: -38, label: 'Casa Cultural' },
    ],
    hotspots: [{ id: 'rueda-info', lon: -15, lat: -8 }]
  },
  'rueda-principal': {
    nombre: 'Rueda de la Fortuna', emoji: '🎡',
    bgColor: 0x200050, fogColor: 0x100030, startLon: 0,
    connections: [
      { to: 'rueda-entrada',   lon: 180, lat: -40, label: 'Volver a la entrada' },
      { to: 'rueda-juegos',    lon:  90, lat: -38, label: 'Área de juegos' },
      { to: 'casa-cultural',   lon:   0, lat: -42, label: 'Casa Cultural' },
    ],
    hotspots: [{ id: 'feria-actividades', lon: 20, lat: -6 }]
  },
  'rueda-juegos': {
    nombre: 'Área de Juegos', emoji: '🎪',
    bgColor: 0x25005a, fogColor: 0x130030, startLon: -90,
    connections: [
      { to: 'rueda-principal', lon: -90, lat: -38, label: 'Rueda de la fortuna' },
      { to: 'casa-cultural',   lon:   0, lat: -42, label: 'Casa Cultural' },
    ],
    hotspots: [{ id: 'feria-actividades', lon: -20, lat: -8 }]
  },
  'casa-cultural': {
    nombre: 'Casa de Cultura', emoji: '🏛',
    bgColor: 0x150030, fogColor: 0x090018, startLon: 90,
    connections: [
      { to: 'rueda-entrada',   lon: -90, lat: -38, label: 'Volver a la feria' },
      { to: 'rueda-principal', lon: 180, lat: -40, label: 'Rueda de la fortuna' },
    ],
    hotspots: [{ id: 'casa-cultura-info', lon: 10, lat: -6 }]
  },
};

// ── IGLESIA ──
const NODES_IGLESIA = {
  'iglesia-entrada': {
    nombre: 'Atrio Principal', emoji: '⛪',
    // imagePath: 'fotos/iglesia/nodo_01.jpg',
    bgColor: 0x2a1a00, fogColor: 0x140d00, startLon: 0,
    connections: [
      { to: 'iglesia-nave',    lon:   0, lat: -42, label: 'Entrar a la nave' },
      { to: 'iglesia-exterior', lon: 90, lat: -38, label: 'Exterior lateral' },
    ],
    hotspots: [{ id: 'iglesia-historia', lon: -20, lat: -6 }]
  },
  'iglesia-nave': {
    nombre: 'Nave Principal', emoji: '🕍',
    bgColor: 0x1e1200, fogColor: 0x0f0900, startLon: 0,
    connections: [
      { to: 'iglesia-entrada', lon: 180, lat: -40, label: 'Salir al atrio' },
      { to: 'iglesia-altar',   lon:   0, lat: -42, label: 'Ir al altar' },
    ],
    hotspots: [{ id: 'iglesia-historia', lon: 30, lat: -5 }]
  },
  'iglesia-altar': {
    nombre: 'Altar Mayor', emoji: '✨',
    bgColor: 0x1a0e00, fogColor: 0x0d0700, startLon: 0,
    connections: [
      { to: 'iglesia-nave',    lon: 180, lat: -40, label: 'Volver a la nave' },
    ],
    hotspots: [{ id: 'iglesia-historia', lon: 0, lat: -5 }]
  },
  'iglesia-exterior': {
    nombre: 'Exterior Sur', emoji: '🌿',
    bgColor: 0x251500, fogColor: 0x120a00, startLon: -90,
    connections: [
      { to: 'iglesia-entrada', lon: -90, lat: -38, label: 'Volver al atrio' },
    ],
    hotspots: []
  },
};

// Mapa de grafos por destino
const GRAFOS = {
  mercado: NODES_MERCADO,
  parque:  NODES_PARQUE,
  choca:   NODES_CHOCA,
  rueda:   NODES_RUEDA,
  iglesia: NODES_IGLESIA,
};


// ════════════════════════════════════════════════════════
//  PUNTOS DE INTERÉS (PUESTOS)
// ════════════════════════════════════════════════════════
const PUESTOS = {
  // ── Mercado ──
  bienvenida: {
    nombre: 'Bienvenidos al Mercado', cat: '📍 Información', emoji: '🏛', badge: 'Centro del Mercado',
    desc: 'El Mercado Municipal de Cosoleacaque es el corazón económico y cultural del municipio. Artesanos, cocineras y agricultores mantienen viva la tradición del sur veracruzano.',
    fotos: ['🏛','🌺','🎊'], prods: []
  },
  tamales: {
    nombre: 'Tamales de Chipilín "Doña Lupe"', cat: '🫔 Gastronomía', emoji: '🫔', badge: 'Especialidad Local',
    desc: 'Los mejores tamales de chipilín del municipio. 30 años de tradición con masa de maíz criollo y hoja de plátano.',
    fotos: ['🫔','🌿','🍃'],
    prods: [
      { e:'🫔', nom:'Tamal Chipilín con Pollo',   det:'Hoja plátano, masa verde',    mxn:35  },
      { e:'🌱', nom:'Tamal Chipilín con Rajas',   det:'Sin carne, chile jalapeño',   mxn:30  },
      { e:'🫘', nom:'Tamal de Frijol Negro',      det:'Frijol criollo, epazote',     mxn:28  },
      { e:'📦', nom:'Docena para envío (12 pzs)', det:'Empaque especial para viaje', mxn:320 },
    ]
  },
  mariscos: {
    nombre: 'Mariscos "Don Chago"', cat: '🦐 Mariscos', emoji: '🦐', badge: 'Frescos del Día',
    desc: 'Mariscos frescos del río Coatzacoalcos y las costas del Golfo. Especialidad: camarones a la diabla y ostiones al mojo.',
    fotos: ['🦐','🦀','🐟'],
    prods: [
      { e:'🦐', nom:'Camarones a la Diabla 250g', det:'Chile árbol, ajo, tomate',       mxn:120 },
      { e:'🫙', nom:'Pasta de Camarón Seco 200g', det:'Tradicional, empacado al vacío', mxn:85  },
      { e:'🌶', nom:'Salsa Macha de Camarón',     det:'Receta abuela, frasco 150ml',    mxn:65  },
    ]
  },
  caldos: {
    nombre: 'Caldos "La Riverita"', cat: '🍲 Comida', emoji: '🍲', badge: 'Desde 1985',
    desc: 'Tres generaciones sirviendo caldos contundentes. Mole negro olmeca y salsas regionales para llevar.',
    fotos: ['🍲','🥘','🫕'],
    prods: [
      { e:'🥫', nom:'Mole Negro Olmeca 300g',    det:'Receta familiar, listo para usar', mxn:145 },
      { e:'🌶', nom:'Chile en Vinagre Casero',   det:'Jalapeños y zanahorias 250ml',     mxn:45  },
      { e:'🫙', nom:'Pasta de Achiote Regional', det:'100% natural, 150g',               mxn:55  },
    ]
  },
  dulces: {
    nombre: 'Dulcería "Los Sabores de Cosolea"', cat: '🍬 Dulces', emoji: '🍬', badge: 'Tradición Dulce',
    desc: 'Dulces artesanales de tamarindo, coco y mamey. Sin conservadores. El souvenir perfecto.',
    fotos: ['🍬','🥥','🍭'],
    prods: [
      { e:'🥥', nom:'Cocada de Coco Tostado 200g', det:'Piloncillo, canela',             mxn:55  },
      { e:'🍬', nom:'Bolas de Tamarindo con Chile', det:'12 piezas sin conservadores',   mxn:40  },
      { e:'🍭', nom:'Jamoncillo de Pepita (caja)',  det:'6 piezas, presentación regalo', mxn:95  },
      { e:'🎁', nom:'Caja Mixta Dulces Cosolea',   det:'20 piezas surtidas para regalo',mxn:185 },
    ]
  },
  bordados: {
    nombre: 'Bordados Nahuas "Artesanas del Sur"', cat: '🧵 Artesanías', emoji: '🧵', badge: 'Hecho a Mano',
    desc: 'Colectivo de 8 artesanas nahuas que bordan motivos de aves tropicales y figuras olmecas.',
    fotos: ['🧵','👗','🌺'],
    prods: [
      { e:'👗', nom:'Blusa Bordada a Mano',      det:'Motivos florales, algodón 100%', mxn:480 },
      { e:'🧣', nom:'Camino de Mesa 40×120cm',   det:'Flores y aves tropicales',       mxn:320 },
      { e:'👜', nom:'Bolsa de Tela Bordada',     det:'Asa larga, cierre, 30×35cm',     mxn:265 },
      { e:'🎀', nom:'Servilletas Bordadas (×4)', det:'Diseños olmecas 40×40cm',         mxn:180 },
    ]
  },
  petate: {
    nombre: 'Petates y Palma "Don Aurelio"', cat: '🌴 Artesanía en Palma', emoji: '🌴', badge: 'Técnica Ancestral',
    desc: '4 generaciones tejiendo la palma coyul — la misma que da nombre a Cosoleacaque.',
    fotos: ['🌴','🎩','🧺'],
    prods: [
      { e:'🎩', nom:'Sombrero de Palma Tejido',  det:'Talla ajustable, acabado fino',  mxn:180 },
      { e:'🧺', nom:'Bolsa de Palma Trenzada',   det:'30×25cm, asa corta',             mxn:145 },
      { e:'🌿', nom:'Abanico de Palma Natural',  det:'Decorativo o funcional, 25cm',   mxn:65  },
      { e:'🪺', nom:'Petate Pequeño 60×80cm',    det:'Tejido tradicional fibra natural',mxn:220 },
    ]
  },
  // ── Parque ──
  'parque-info': {
    nombre: 'Parque Central de Cosoleacaque', cat: '🌳 Espacio Público', emoji: '🌳', badge: 'Patrimonio Urbano',
    desc: 'El parque central es el punto de reunión más importante del municipio. Diseñado con jardines tropicales, andadores y el kiosco donde se presentan grupos de son jarocho los fines de semana.',
    fotos: ['🌳','🌺','🎵'], prods: []
  },
  'kiosco-cultural': {
    nombre: 'Kiosco Municipal', cat: '🎵 Cultura Viva', emoji: '🎶', badge: 'Son Jarocho',
    desc: 'El kiosco es escenario de fandangos comunitarios, presentaciones de danza folclórica y eventos cívicos. Los domingos hay música en vivo a partir de las 6pm.',
    fotos: ['🎶','🎸','💃'], prods: []
  },
  // ── Choca ──
  'choca-info': {
    nombre: 'Centro Deportivo La Choca', cat: '⚽ Deporte', emoji: '🏟️', badge: 'Orgullo Cosoleacaquense',
    desc: 'El complejo deportivo más importante del municipio. Cuenta con cancha de fútbol, pista de atletismo, canchas de básquetbol y áreas de entrenamiento. Sede de torneos regionales.',
    fotos: ['🏟️','⚽','🏃'], prods: []
  },
  'choca-actividades': {
    nombre: 'Actividades y Eventos', cat: '📅 Agenda Deportiva', emoji: '📋', badge: 'Calendario',
    desc: 'Torneos intermunicipales, ligas locales de fútbol y básquetbol, y clases de atletismo para todas las edades. Consulta el calendario de eventos en la administración.',
    fotos: ['📋','🏆','🎯'], prods: []
  },
  // ── Rueda / Casa Cultural ──
  'rueda-info': {
    nombre: 'Parque de Atracciones', cat: '🎡 Entretenimiento', emoji: '🎠', badge: 'Para Toda la Familia',
    desc: 'La rueda de la fortuna y las atracciones de la feria son un clásico de las tardes y noches en Cosoleacaque. Ambiente familiar, comida típica y diversión garantizada.',
    fotos: ['🎡','🎪','🌟'], prods: []
  },
  'feria-actividades': {
    nombre: 'Juegos y Diversión', cat: '🎪 Feria Local', emoji: '🎯', badge: 'Clásico Municipal',
    desc: 'Desde juegos mecánicos hasta actividades culturales, el parque ofrece una experiencia completa. Los fines de semana hay puestos de antojitos veracruzanos alrededor.',
    fotos: ['🎯','🎠','🌮'], prods: []
  },
  'casa-cultura-info': {
    nombre: 'Casa de Cultura Municipal', cat: '🏛 Cultura', emoji: '🎨', badge: 'Arte & Tradición',
    desc: 'Espacio dedicado a la preservación y difusión de las artes y culturas locales. Ofrece talleres de danza, música, pintura y teatro para niños, jóvenes y adultos.',
    fotos: ['🎨','🎭','📚'], prods: []
  },
  // ── Iglesia ──
  'iglesia-historia': {
    nombre: 'Parroquia San Juan Bautista', cat: '⛪ Patrimonio', emoji: '✝️', badge: 'Siglo XVIII',
    desc: 'La parroquia de San Juan Bautista es el templo más antiguo e importante del municipio. Su arquitectura mestiza colonial data del siglo XVIII y alberga retablos barrocos y figuras de santos veneradas por la comunidad.',
    fotos: ['⛪','✝️','🌸'], prods: []
  },
};


// ════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ════════════════════════════════════════════════════════
let currentDestino = null;  // id del destino activo
let NODES = {};             // grafo activo
let currentNode = null;
let cart = [];
let visited = new Set();


// ════════════════════════════════════════════════════════
//  CARRUSEL
// ════════════════════════════════════════════════════════
let carIdx = 0; // índice activo en DESTINOS

function buildCarousel() {
  const stage = document.getElementById('carStage');
  const dots  = document.getElementById('carDots');
  stage.innerHTML = '';
  dots.innerHTML  = '';

  DESTINOS.forEach((dest, i) => {
    // Tarjeta
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.idx = i;

    const hasImg = dest.imagen;
    const imgSection = hasImg
      ? `<div class="card-img-wrap">
           <img src="${dest.imagen}" alt="${dest.nombre}" loading="lazy"
                onerror="this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\'>${dest.tag.split(' ')[0]}</div>'">
         </div>`
      : `<div class="card-img-placeholder" style="background:${dest.colorBg}">${dest.tag.split(' ')[0]}</div>`;

    card.innerHTML = `
      ${imgSection}
      <div class="card-body">
        <div class="card-tag">${dest.tag}</div>
        <div class="card-name">${dest.nombre}</div>
        <div class="card-desc">${dest.desc}</div>
        <button class="card-btn" data-idx="${i}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
          Explorar
        </button>
      </div>`;

    // Click en tarjeta lateral → avanzar al centro
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-btn')) return; // lo maneja el botón
      const pos = getPosRelativa(i);
      if (pos === 1)  carAvanzar(1);
      if (pos === -1) carAvanzar(-1);
    });

    // Click en botón Explorar
    card.querySelector('.card-btn').addEventListener('click', () => {
      if (getPosRelativa(i) !== 0) {
        carIdx = i; updateCarousel(); return;
      }
      entrarDestino(dest.id);
    });

    stage.appendChild(card);

    // Dot
    const dot = document.createElement('div');
    dot.className = 'car-dot';
    dot.dataset.idx = i;
    dot.addEventListener('click', () => { carIdx = i; updateCarousel(); });
    dots.appendChild(dot);
  });

  updateCarousel();
}

function getPosRelativa(i) {
  const total = DESTINOS.length;
  let diff = ((i - carIdx) % total + total) % total;
  if (diff > total / 2) diff -= total;
  return diff;
}

function updateCarousel() {
  const cards = document.querySelectorAll('.car-card');
  const dots  = document.querySelectorAll('.car-dot');

  cards.forEach((card, i) => {
    const pos = getPosRelativa(i);
    const clamped = Math.max(-3, Math.min(3, pos));
    card.dataset.pos = clamped === 0 ? '0'
      : clamped > 2  ? '999'
      : clamped < -2 ? '999'
      : String(clamped);
  });

  dots.forEach((dot, i) => dot.classList.toggle('on', i === carIdx));
}

function carAvanzar(dir) {
  carIdx = ((carIdx + dir) % DESTINOS.length + DESTINOS.length) % DESTINOS.length;
  updateCarousel();
}

// Flechas
document.getElementById('carPrev').addEventListener('click', () => carAvanzar(-1));
document.getElementById('carNext').addEventListener('click', () => carAvanzar(1));

// Touch swipe en el carrusel
let swipeX0 = null;
document.getElementById('carStage').addEventListener('touchstart', e => {
  swipeX0 = e.touches[0].clientX;
}, { passive: true });
document.getElementById('carStage').addEventListener('touchend', e => {
  if (swipeX0 === null) return;
  const dx = e.changedTouches[0].clientX - swipeX0;
  if (Math.abs(dx) > 40) carAvanzar(dx < 0 ? 1 : -1);
  swipeX0 = null;
});

// Teclado en selector
document.addEventListener('keydown', e => {
  if (!document.getElementById('selector').classList.contains('out')) {
    if (e.key === 'ArrowLeft')  carAvanzar(-1);
    if (e.key === 'ArrowRight') carAvanzar(1);
    if (e.key === 'Enter')      entrarDestino(DESTINOS[carIdx].id);
  }
});

// Inicializar carrusel
buildCarousel();


// ════════════════════════════════════════════════════════
//  RETORNO DESDE TOUR A-FRAME
//  Si la URL trae ?from=tour&dest=XXX, enfocar esa tarjeta
// ════════════════════════════════════════════════════════
(function handleReturnFromTour() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('from') === 'tour') {
    const destId = params.get('dest');
    const idx = DESTINOS.findIndex(d => d.id === destId);
    if (idx !== -1) {
      carIdx = idx;
      updateCarousel();
    }
    // Limpiar URL para que no quede sucia si refrescan
    window.history.replaceState({}, '', window.location.pathname);
  }
})();


// ════════════════════════════════════════════════════════
//  THREE.JS — VISOR 360
// ════════════════════════════════════════════════════════
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene3 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0.01);

let lon = 0, lat = 0;
let isDrag = false, sx = 0, sy = 0, sl = 0, sb = 0;

// Render loop
function animate() {
  requestAnimationFrame(animate);
  lat = Math.max(-85, Math.min(85, lat));
  const phi   = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  camera.lookAt(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta)
  );
  updateOverlayPositions();
  renderer.render(scene3, camera);
}
animate();


// ════════════════════════════════════════════════════════
//  NAVEGACIÓN: SELECTOR ↔ VISOR
// ════════════════════════════════════════════════════════
async function entrarDestino(destinoId) {
  const dest = DESTINOS.find(d => d.id === destinoId);
  if (!dest) return;

  // ─── Si el destino tiene tour A-Frame (WebXR / Quest 3), redirigir ───
  if (dest.tourVR) {
    // Salida del selector con animación
    const sel = document.getElementById('selector');
    sel.classList.add('out');

    // Mostrar loading mientras se navega
    document.getElementById('loading').classList.remove('hide');
    document.getElementById('ltxt').textContent = `Cargando ${dest.nombre}…`;

    // Pequeña espera para que se vea la transición
    await delay(500);

    // Redirigir al tour A-Frame
    window.location.href = dest.tourVR;
    return;
  }

  // ─── Flujo original: visor Three.js con colores planos ───

  // Salida del selector
  const sel = document.getElementById('selector');
  sel.classList.add('out');

  // Mostrar loading
  document.getElementById('loading').classList.remove('hide');
  document.getElementById('ltxt').textContent = `Cargando ${dest.nombre}…`;

  // Pequeña espera para la animación
  await delay(400);

  // Activar visor
  const viewer = document.getElementById('viewer360');
  viewer.classList.remove('v-hidden');
  viewer.classList.add('v-visible');

  // Actualizar título del destino en topbar
  document.getElementById('tb-dest').innerHTML = `<em>${dest.nombre}</em>`;
  document.getElementById('mm-title').textContent = `✦ ${dest.nombre}`;

  // Cargar grafo del destino
  currentDestino = destinoId;
  NODES = GRAFOS[destinoId] || {};
  visited.clear();

  await gotoNode(dest.primerNodo, true);

  document.getElementById('loading').classList.add('hide');
}

function volverAlSelector() {
  // Ocultar visor
  const viewer = document.getElementById('viewer360');
  viewer.classList.remove('v-visible');
  viewer.classList.add('v-hidden');

  // Cerrar panel y carrito si están abiertos
  closePanel();
  document.getElementById('mCart').classList.remove('open');

  // Mostrar selector
  const sel = document.getElementById('selector');
  sel.classList.remove('out');

  currentDestino = null;
  NODES = {};
  currentNode = null;
  visited.clear();

  // Limpiar escena
  while (scene3.children.length) scene3.remove(scene3.children[0]);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }


// ════════════════════════════════════════════════════════
//  CARGA DE NODO
// ════════════════════════════════════════════════════════
async function gotoNode(nodeId, instant = false) {
  const node = NODES[nodeId];
  if (!node) return;

  if (!instant) await fadeOut();

  while (scene3.children.length) scene3.remove(scene3.children[0]);

  const geo = new THREE.SphereGeometry(500, 64, 32);
  geo.scale(-1, 1, 1);

  // Con foto real: descomenta y ajusta la ruta
  // const material = node.imagePath
  //   ? await loadTextureMaterial(node.imagePath)
  //   : makePlaceholder(node);

  const material = makePlaceholder(node);

  scene3.add(new THREE.Mesh(geo, material));
  scene3.fog = new THREE.FogExp2(node.fogColor, 0.0007);

  lon = node.startLon ?? 0;
  lat = 0;
  currentNode = nodeId;
  visited.add(nodeId);

  document.getElementById('node-info').textContent = `${node.emoji}  ${node.nombre}`;

  buildNavOverlay(node);
  buildMinimap();
  closePanel();

  if (!instant) await fadeIn();
}

function loadTextureMaterial(path) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(path, (tex) => {
      resolve(new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide }));
    });
  });
}

function makePlaceholder(node) {
  const W = 2048, H = 1024;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  const c1 = '#' + node.bgColor.toString(16).padStart(6, '0');
  const c2 = '#' + node.fogColor.toString(16).padStart(6, '0');
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,    '#0d0512');
  g.addColorStop(0.3,  c1);
  g.addColorStop(0.65, c1);
  g.addColorStop(1,    c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, H * 0.65, W, H * 0.35);

  ctx.strokeStyle = 'rgba(224,19,108,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H * 0.65); ctx.lineTo(W, H * 0.65); ctx.stroke();

  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H * 0.65, Math.random() * 45 + 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`; ctx.fill();
  }

  ctx.save();
  ctx.globalAlpha = 0.07; ctx.fillStyle = '#fff';
  ctx.font = 'bold 75px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(node.nombre, W / 2, H * 0.43);
  ctx.font = '22px monospace';
  ctx.fillText('COSOLEACAQUE · VERACRUZ · MÉXICO', W / 2, H * 0.55);
  ctx.restore();

  return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), side: THREE.BackSide });
}

function fadeOut() {
  return new Promise(res => {
    document.getElementById('fade').classList.add('in');
    setTimeout(res, 380);
  });
}
function fadeIn() {
  return new Promise(res => {
    document.getElementById('fade').classList.remove('in');
    setTimeout(res, 380);
  });
}


// ════════════════════════════════════════════════════════
//  OVERLAY DE FLECHAS Y HOTSPOTS
// ════════════════════════════════════════════════════════
function buildNavOverlay(node) {
  const layer = document.getElementById('nav-layer');
  layer.innerHTML = '';

  (node.connections || []).forEach(conn => {
    const el = document.createElement('div');
    el.className = 'nav-arrow';
    el.dataset.lon = conn.lon;
    el.dataset.lat = conn.lat;

    const angle = ((conn.lon - lon) % 360 + 360) % 360;
    el.innerHTML = `
      <div class="arr-ring">
        <svg class="arr-chevron" viewBox="0 0 24 24"
          style="transform:rotate(${angle > 180 ? angle - 360 : angle}deg)">
          <polyline points="18,15 12,9 6,15"/>
        </svg>
      </div>
      <div class="arr-label">${conn.label}</div>`;

    el.addEventListener('click', e => { e.stopPropagation(); gotoNode(conn.to); });
    layer.appendChild(el);
  });

  (node.hotspots || []).forEach(hs => {
    const p = PUESTOS[hs.id];
    if (!p) return;
    const el = document.createElement('div');
    el.className = 'hs-puesto';
    el.dataset.lon = hs.lon;
    el.dataset.lat = hs.lat;
    el.innerHTML = `
      <div class="hs-puesto-ring"><div class="hs-puesto-dot"></div></div>
      <div class="hs-puesto-label">${p.nombre}</div>`;
    el.addEventListener('click', e => { e.stopPropagation(); openPanel(hs.id); });
    layer.appendChild(el);
  });
}

function lonLatToScreen(lonDeg, latDeg) {
  const phi   = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg);
  const v = new THREE.Vector3(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta)
  );
  const proj = v.clone().project(camera);
  return {
    x:       (proj.x + 1) / 2 * window.innerWidth,
    y:       -(proj.y - 1) / 2 * window.innerHeight,
    visible: proj.z < 1
  };
}

function updateOverlayPositions() {
  document.querySelectorAll('.nav-arrow, .hs-puesto').forEach(el => {
    const { x, y, visible } = lonLatToScreen(
      parseFloat(el.dataset.lon),
      parseFloat(el.dataset.lat)
    );
    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.display = visible ? 'flex' : 'none';
  });
}


// ════════════════════════════════════════════════════════
//  MINIMAPA
// ════════════════════════════════════════════════════════
function buildMinimap() {
  const container = document.getElementById('mm-nodes');
  container.innerHTML = '';
  Object.entries(NODES).forEach(([id, node]) => {
    const btn = document.createElement('div');
    btn.className = 'mm-node' +
      (id === currentNode ? ' curr' : '') +
      (visited.has(id) && id !== currentNode ? ' visited' : '');
    btn.textContent = node.emoji;
    const tip = document.createElement('div');
    tip.className = 'mm-tip';
    tip.textContent = node.nombre;
    btn.appendChild(tip);
    btn.addEventListener('click', () => gotoNode(id));
    container.appendChild(btn);
  });
}


// ════════════════════════════════════════════════════════
//  CONTROLES DE CÁMARA
// ════════════════════════════════════════════════════════
function getXY(e) {
  return e.touches
    ? { x: e.touches[0].pageX, y: e.touches[0].pageY }
    : { x: e.clientX, y: e.clientY };
}

canvas.addEventListener('mousedown', e => {
  isDrag = true;
  const { x, y } = getXY(e);
  sx = x; sy = y; sl = lon; sb = lat;
  canvas.classList.add('drag');
});
canvas.addEventListener('touchstart', e => {
  isDrag = true;
  const { x, y } = getXY(e);
  sx = x; sy = y; sl = lon; sb = lat;
}, { passive: true });

canvas.addEventListener('mousemove', e => {
  if (!isDrag) return;
  const { x, y } = getXY(e);
  lon = (sx - x) * 0.18 + sl;
  lat = (y - sy) * 0.18 + sb;
});
canvas.addEventListener('touchmove', e => {
  if (!isDrag) return;
  e.preventDefault();
  const { x, y } = getXY(e);
  lon = (sx - x) * 0.18 + sl;
  lat = (y - sy) * 0.18 + sb;
}, { passive: false });

canvas.addEventListener('mouseup',    () => { isDrag = false; canvas.classList.remove('drag'); });
canvas.addEventListener('touchend',   () => { isDrag = false; });
canvas.addEventListener('mouseleave', () => { isDrag = false; canvas.classList.remove('drag'); });

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.04, 30, 100);
  camera.updateProjectionMatrix();
}, { passive: false });

document.addEventListener('keydown', e => {
  // Solo si el visor está activo
  if (document.getElementById('viewer360').classList.contains('v-hidden')) return;
  const step = 8;
  if (e.key === 'ArrowLeft')  lon -= step;
  if (e.key === 'ArrowRight') lon += step;
  if (e.key === 'ArrowUp')    lat = Math.min(85, lat + 5);
  if (e.key === 'ArrowDown')  lat = Math.max(-85, lat - 5);
  if (e.key === 'Escape') {
    if (document.getElementById('panel').classList.contains('open')) closePanel();
    else if (document.getElementById('mCart').classList.contains('open')) document.getElementById('mCart').classList.remove('open');
    else volverAlSelector();
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ════════════════════════════════════════════════════════
//  PANEL DE PUESTO
// ════════════════════════════════════════════════════════
function openPanel(id) {
  const p = PUESTOS[id];
  if (!p) return;

  document.getElementById('pemoji').textContent = p.emoji;
  document.getElementById('pbadge').textContent = p.badge;
  document.getElementById('pcat').textContent   = p.cat;
  document.getElementById('pname').textContent  = p.nombre;
  document.getElementById('pdesc').textContent  = p.desc;

  const gal = document.getElementById('pgal');
  gal.innerHTML = '';
  p.fotos.forEach(f => {
    const d = document.createElement('div');
    d.className = 'pgali'; d.textContent = f;
    gal.appendChild(d);
  });

  const sec   = document.getElementById('psec');
  const prods = document.getElementById('pprods');
  prods.innerHTML = '';

  if (p.prods && p.prods.length) {
    sec.textContent = '✦ Productos · Envío internacional disponible';
    p.prods.forEach(pr => {
      const row = document.createElement('div');
      row.className = 'prow';
      row.innerHTML = `
        <div class="pe">${pr.e}</div>
        <div class="pi">
          <div class="pn">${pr.nom}</div>
          <div class="pd">${pr.det}</div>
        </div>
        <div class="pp">$${pr.mxn} MXN</div>
        <button class="badd">+</button>`;
      row.querySelector('.badd').onclick = () => addToCart(id, pr, p.nombre);
      prods.appendChild(row);
    });
    document.getElementById('pfoot').textContent = '✈️  Envío via DHL Express · Desde Cosoleacaque al mundo';
  } else {
    sec.textContent = '';
    document.getElementById('pfoot').textContent = '';
  }

  document.getElementById('panel').classList.add('open');
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
}


// ════════════════════════════════════════════════════════
//  CARRITO
// ════════════════════════════════════════════════════════
function addToCart(pid, pr, pNom) {
  const ex = cart.find(i => i.nom === pr.nom);
  ex ? ex.qty++ : cart.push({ ...pr, pid, pNom, qty: 1 });
  updateCartTotals();
  showToast(`✓  ${pr.nom} agregado`);
}

function removeFromCart(i) { cart.splice(i, 1); renderCartList(); }

function updateCartTotals() {
  const tot = cart.reduce((s, i) => s + i.mxn * i.qty, 0);
  document.getElementById('cqty').textContent = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('csub').textContent = `$${tot.toLocaleString()} MXN`;
  document.getElementById('ctot').textContent = `$${tot.toLocaleString()} MXN`;
}

function renderCartList() {
  const el = document.getElementById('clist');
  if (!cart.length) {
    el.innerHTML = '<div class="cempty">🧺<br>Tu canasta está vacía.<br>¡Explora el mercado!</div>';
    updateCartTotals(); return;
  }
  el.innerHTML = cart.map((it, i) => `
    <div class="crow">
      <div class="cre">${it.e}</div>
      <div class="cri">
        <div class="crn">${it.nom}${it.qty > 1 ? ' ×' + it.qty : ''}</div>
        <div class="crp2">${it.pNom}</div>
      </div>
      <div class="crp">$${(it.mxn * it.qty).toLocaleString()} MXN</div>
      <button class="crm" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');
  updateCartTotals();
}

function toggleCart() {
  renderCartList();
  document.getElementById('mCart').classList.toggle('open');
}

function checkout() {
  if (!cart.length) { showToast('Tu canasta está vacía'); return; }
  showToast('🚧 Integración de pagos próximamente');
}


// ── TOAST ──
let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── CERRAR MODAL FUERA ──
document.getElementById('mCart').addEventListener('click', e => {
  if (e.target === document.getElementById('mCart'))
    document.getElementById('mCart').classList.remove('open');
});
