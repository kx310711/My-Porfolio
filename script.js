/*  Illinois Fermin Portfolio — script.js aqui voy a incluir una guia de como lo hice 
asi lo puedan hacer tambien! :) tratare de escribir en ingles y español
 ya que el ingles es uno de los idiomas mas hablado y el español tambien
 mostrar en las notas : nav, counters, accordion, reveal, back-top,
             contact form, AND classic/retro Geocities mode */

// Empecemos con la navegacion. Getelementbyid nav, sera:  NAV scroll state ---
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  function tick() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

// Tomen Mobile burger ----
(function () {
  var burger = document.getElementById('nav_burger');
  var links  = document.getElementById('nav_links');
  if (!burger || !links) return;
  function setOpen(open) {
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 700) setOpen(false); });
})();

// ── Stat counters ---- recordar explicar no hay tiempo
(function () {
  var nodes = document.querySelectorAll('.stat-n[data-target]');
  if (!nodes.length) return;
  function anim(node) {
    var target = Number(node.getAttribute('data-target')) || 0;
    var t0 = performance.now(), dur = 1100;
    function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else node.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var obs = new IntersectionObserver(function (entries, o) {
    entries.forEach(function (e) { if (e.isIntersecting) { anim(e.target); o.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nodes.forEach(function (n) { obs.observe(n); });
})();

// ----- recuerden ser original y tomar mi codigo de referencia, este es el Experience accordion 
(function () {
  var items = document.querySelectorAll('.exp-item');
  items.forEach(function (item) {
    var btn = item.querySelector('.exp-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      items.forEach(function (o) {
        o.classList.remove('is-open');
        var b = o.querySelector('.exp-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
})();

// ── Scroll reveal ----
(function () {
  var sel = '.s-title, .s-tag, .about-text, .contact-pills, .skill-card, .cert-item, .edu-item, .proj-card, .rec-card, .contact-info, .contact-form, .hero-stats';
  var targets = document.querySelectorAll(sel);
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.setProperty('--rd', (i % 6) * 60 + 'ms');
  });
  var obs = new IntersectionObserver(function (entries, o) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { obs.observe(el); });
})();

// Vamos para arriba, Back to top ----- fast
(function () {
  var btn = document.querySelector('.back-top');
  if (!btn) return;
  window.addEventListener('scroll', function () { btn.classList.toggle('show', window.scrollY > 400); }, { passive: true });
})();

// recordar mejorar y optimizar, formulario de contact./ Contact form 
(function () {
  var form    = document.getElementById('contact_form');
  var popup   = document.getElementById('popup');
  var closeBtn = document.getElementById('popup_close');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = (document.getElementById('f_name') || {}).value || '';
    var msg  = ((document.getElementById('f_msg') || {}).value || '').trim();
    if (!msg) { var ta = document.getElementById('f_msg'); if (ta) ta.focus(); return; }
    var list = document.getElementById('recs_list');
    if (list) {
      var bq = document.createElement('blockquote');
      bq.className = 'rec-card';
      var author = name.trim() ? ' \u2014 ' + name.trim() : '';
      bq.innerHTML = '<p>\u201c' + msg + '\u201d' + author + '</p>';
      bq.style.cssText = 'opacity:0;transform:translateY(12px)';
      list.appendChild(bq);
      requestAnimationFrame(function () {
        bq.style.transition = 'opacity .4s ease, transform .4s ease';
        bq.style.opacity = '1'; bq.style.transform = 'none';
      });
    }
    form.reset();
    if (popup) popup.showModal();
  });
  if (closeBtn && popup) closeBtn.addEventListener('click', function () { if (popup.open) popup.close(); });
})();

//Fondo teal/gris de Windows 95 con patrón de tiles, Colores Geocities: azul marino 
// ══════════════════════════════════════════════════════════
// ██████  CLASSIC / GEOCITIES RETRO MODE ██████████████████ Botones y paneles con el clásico borde outset/inset de Win95 se puede tambien remplazar imitandos las antiguas mac pero prefiero hacerlo asi
// ══════════════════════════════════════════════════════════
//Me siento old, creo que estoy embejeciendo 

(function () {
  var toggle   = document.getElementById('classic_toggle');
  var loader   = document.getElementById('retro_loader');
  var statusbar = document.getElementById('retro_status');
  if (!toggle) return;

  // ── Pixel art sprite generator (box-shadow technique) Pixel sprites generados en canvas: una computadora, estrellas y corazones 
  // — dibujados píxel por píxel con arrays de colores
  // Each sprite is an 8×8 pixel grid defined as a flat array (0=empty, color=filled)
  var SPRITES = {
    computer: {
      size: 8,
      pixels: [
        0,'#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0',0,
        '#808080','#000080','#000080','#000080','#000080','#000080','#000080','#808080',
        '#808080','#0000aa','#ffffff','#0000ff','#ffffff','#0000ff','#0000aa','#808080',
        '#808080','#0000aa','#0000ff','#ffffff','#0000ff','#ffffff','#0000aa','#808080',
        '#808080','#000080','#000080','#000080','#000080','#000080','#000080','#808080',
        0,'#c0c0c0','#808080','#c0c0c0','#c0c0c0','#808080','#c0c0c0',0,
        0,0,'#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0',0,0,
        0,'#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0','#c0c0c0',0
      ]
    },
    star: {
      size: 8,
      pixels: [
        0,0,0,'#ffff00',0,0,0,0,
        0,0,'#ffff00','#ffff00','#ffff00',0,0,0,
        0,'#ffff00','#ffff00','#ffffff','#ffff00','#ffff00',0,0,
        '#ffff00','#ffff00','#ffffff','#ffffff','#ffffff','#ffff00','#ffff00',0,
        0,'#ffff00','#ffff00','#ffffff','#ffff00','#ffff00',0,0,
        0,0,'#ffff00','#ffff00','#ffff00',0,0,0,
        0,0,0,'#ffff00',0,0,0,0,
        0,0,0,0,0,0,0,0
      ]
    },
    heart: {
      size: 8,
      pixels: [
        0,'#ff0000','#ff0000',0,0,'#ff0000','#ff0000',0,
        '#ff0000','#ff6666','#ff0000','#ff0000','#ff0000','#ff0000','#ff6666','#ff0000',
        '#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000',
        '#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000',
        0,'#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000',0,
        0,0,'#ff0000','#ff0000','#ff0000','#ff0000',0,0,
        0,0,0,'#ff0000','#ff0000',0,0,0,
        0,0,0,0,0,0,0,0
      ]
    },
    cursor: {
      size: 6,
      pixels: [
        '#ffff00',0,0,0,0,0,
        '#ffff00','#ffff00',0,0,0,0,
        '#ffff00','#ffffff','#ffff00',0,0,0,
        '#ffff00','#ffffff','#ffffff','#ffff00',0,0,
        '#ffff00','#ffff00','#ffff00','#ffff00','#ffff00',0,
        0,0,0,0,0,0
      ]
    }
  };

  function buildSprite(name, scale) {
    scale = scale || 2;
    var sp = SPRITES[name]; if (!sp) return null;
    var canvas = document.createElement('canvas');
    canvas.width  = sp.size * scale;
    canvas.height = sp.size * scale;
    canvas.style.imageRendering = 'pixelated';
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < sp.pixels.length; i++) {
      var col = sp.pixels[i];
      if (!col) continue;
      var x = (i % sp.size) * scale;
      var y = Math.floor(i / sp.size) * scale;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, scale, scale);
    }
    return canvas;
  }

  function spriteSrc(name, scale) {
    var c = buildSprite(name, scale); return c ? c.toDataURL() : '';
  }

  // Bloque decorativo, retro decorative HTML block ──
  function buildRetroDecos() {
    // Pixel art banner at top of hero / Modificar al gusto, y nd
    var banner = document.createElement('div');
    banner.className = 'retro-pixel-banner';
    banner.textContent = '&#9733; ILLINOIS FERMIN\'S HOMEPAGE &#9733; WEB DEVELOPER &#9733; SANTO DOMINGO DR &#9733; VISITOR #' + String(Math.floor(Math.random()*99999+1000)).padStart(6,'0') + ' &#9733; BEST VIEWED IN NETSCAPE NAVIGATOR &#9733;';

    // Pixel decoration strip
    //Status bar en la parte inferior mostrando URLs al hacer hover (igual que Netscape)
    var deco = document.createElement('div');
    deco.className = 'retro-deco';
    deco.id = 'retro_deco';

    // Build pixel art images / arreglar variables despues..
    var compImg  = buildSprite('computer', 3);
    var starImg  = buildSprite('star', 2);
    var heartImg = buildSprite('heart', 2);

    function imgEl(canvas, alt) {
      var img = document.createElement('img');
      img.src = canvas ? canvas.toDataURL() : '';
      img.alt = alt; img.style.cssText = 'image-rendering:pixelated;vertical-align:middle;margin:0 6px';
      return img;
    }

    deco.appendChild(imgEl(starImg, '★'));
    deco.appendChild(document.createTextNode(' Illinois Fermin '));
    deco.appendChild(imgEl(compImg, '[PC]'));
    deco.appendChild(document.createTextNode(' Front-End Developer '));
    deco.appendChild(imgEl(heartImg, '♥'));
    var br1 = document.createElement('br'); deco.appendChild(br1);
    deco.appendChild(document.createTextNode('☆═══════════════════════════════════════☆'));

    var hero = document.getElementById('hero');
    if (hero) {
      var heroInner = hero.querySelector('.hero-inner');
      if (heroInner) hero.insertBefore(deco, heroInner);
      hero.insertBefore(banner, hero.firstChild);
    }

    return { banner: banner, deco: deco };
  }

  // Retro status bar hover 
  function initStatusBar() {
    if (!statusbar) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        if (!document.body.classList.contains('retro-mode')) return;
        var href = a.getAttribute('href') || '';
        statusbar.textContent = href.startsWith('#') ? 'Jump to: ' + href : 'Link: ' + href;
      });
      a.addEventListener('mouseleave', function () {
        statusbar.textContent = '\u2605 Welcome to Illinois Fermin\'s Homepage \u2605 Best viewed in 800x600 \u2605';
      });
    });
  }

  // Pixel cursor trail --Cursor de pixeles, editar color como desees, Cursor trail de partículas 
  // de colores aleatorios al mover el mouse
  var trailActive = false;
  var trailColors = ['#ffff00','#ff0000','#00ffff','#ff00ff','#00ff00','#ffffff'];
  function initTrail() {
    if (trailActive) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    trailActive = true;
    var last = 0;
    window.addEventListener('mousemove', function (e) {
      if (!document.body.classList.contains('retro-mode')) return;
      var now = performance.now();
      if (now - last < 30) return;
      last = now;
      var dot = document.createElement('div');
      dot.className = 'retro-spark';
      var col = trailColors[Math.floor(Math.random() * trailColors.length)];
      dot.style.cssText = 'left:' + e.clientX + 'px;top:' + e.clientY + 'px;background:' + col + ';';
      document.body.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 620);
    });
  }

  // Loader bar animation ---La funcion para la animacion barra de carga
  function playLoader() {
    if (!loader) return;
    loader.classList.remove('loading');
    void loader.offsetWidth;
    loader.classList.add('loading');
    setTimeout(function () { loader.classList.remove('loading'); }, 1900);
  }

  //  Build retro decos once / vamos asegurarnos de hacerlo correcto
  var decos = null;
  function ensureDecos() {
    if (!decos) decos = buildRetroDecos();
  }

  // Activate / deactivate / activar y desactivar
  function activate() {
    document.body.classList.add('retro-mode');
    toggle.textContent = '\u{1F5A5} Modern';
    toggle.setAttribute('aria-pressed', 'true');
    localStorage.setItem('portfolio_mode', 'classic');
    ensureDecos();
    playLoader();
    initTrail();
    initStatusBar();
  }

  function deactivate() {
    document.body.classList.remove('retro-mode');
    toggle.textContent = '\uD83D\uDC7E Classic';
    toggle.setAttribute('aria-pressed', 'false');
    localStorage.setItem('portfolio_mode', 'modern');
  }

  // ── Restore saved preference /recuperar preferencia
  if (localStorage.getItem('portfolio_mode') === 'classic') {
    activate();
  }

  toggle.addEventListener('click', function () {
    if (document.body.classList.contains('retro-mode')) deactivate();
    else activate();
  });
})();
