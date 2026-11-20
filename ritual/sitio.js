(function () {
  var rooms = { inicio: 1, tocador: 1, piel: 1, color: 1, perfume: 1, cuerpo: 1, novedades: 1 };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function vistaFor(hash) {
    var id = (hash || '').replace('#', '');
    if (id === 'look' || id === 'notas') return 'novedades';
    if (id === 'para-quien') return 'tocador';
    if (id === 'equipo' || id === 'compania' || id === 'clase' || id === 'portada') return 'inicio';
    if (rooms[id]) return id;
    return 'inicio';
  }

  function navFor(vista) {
    if (vista === 'piel' || vista === 'color' || vista === 'perfume' || vista === 'cuerpo') return 'tocador';
    if (vista === 'novedades') return 'novedades';
    if (vista === 'tocador') return 'tocador';
    return 'inicio';
  }

  function play(film) {
    if (!film || reduce) return;
    var p = film.play();
    if (p && p.catch) p.catch(function () {});
  }

  function heroFilm() {
    var hero = document.querySelector('.hero');
    var film = document.querySelector('.hero-film');
    if (!hero || !film || reduce) return;
    film.setAttribute('webkit-playsinline', '');
    film.src = '../img/hero-16x9.mp4?v=16';
    film.addEventListener('playing', function () { hero.classList.add('is-live'); });
    var vis = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && document.body.dataset.vista === 'inicio') play(film);
        else film.pause();
      });
    }, { threshold: 0.2 });
    vis.observe(hero);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) film.pause();
      else if (document.body.dataset.vista === 'inicio') play(film);
    });
  }

  function labialFilm() {
    var frame = document.querySelector('.deseo-frame');
    var film = document.querySelector('.labial-film');
    if (!frame || !film || reduce) return;
    film.setAttribute('webkit-playsinline', '');
    film.addEventListener('playing', function () { frame.classList.add('is-live'); });
    var on = false;
    function arm() {
      if (on) return;
      on = true;
      film.src = '../img/labial.mp4?v=18';
    }
    window.armLabial = function (show) {
      if (!show) { film.pause(); return; }
      arm();
      play(film);
    };
  }

  function scrolled() {
    document.body.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  function apply() {
    var hash = location.hash || '';
    var id = hash.replace('#', '');
    var vista = vistaFor(hash);
    var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone && !hash) {
      location.hash = '#look';
      return;
    }
    document.body.dataset.vista = vista;
    document.querySelectorAll('.vista').forEach(function (el) {
      el.classList.toggle('is-on', el.id === vista);
    });
    var nav = navFor(vista);
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (window.armLabial) window.armLabial(vista === 'color');
    requestAnimationFrame(function () {
      var target = id && document.getElementById(id);
      if (target && id !== vista) target.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
      scrolled();
    });
  }

  heroFilm();
  labialFilm();
  window.addEventListener('hashchange', apply);
  window.addEventListener('scroll', scrolled, { passive: true });
  apply();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js?v=2');

  var seccion = document.getElementById('instalar');
  var boton = document.getElementById('btn-instalar');
  var barra = document.getElementById('aviso-instalar');
  var aviso = null;
  var clave = 'bqd-instalar';
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone) {
    if (seccion) seccion.hidden = true;
    return;
  }
  var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function cerrarBarra() {
    try { localStorage.setItem(clave, 'no'); } catch (err) {}
    if (barra) barra.hidden = true;
  }
  function mostrarBarra() {
    var guardado = '';
    try { guardado = localStorage.getItem(clave) || ''; } catch (err) {}
    if (guardado === 'no' || !barra) return;
    barra.hidden = false;
  }
  function instalar() {
    if (aviso) {
      aviso.prompt();
      aviso.userChoice.finally(function () { aviso = null; if (barra) barra.hidden = true; });
      return;
    }
    window.location.href = './instalar.html';
  }
  if (esIOS) mostrarBarra();
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    aviso = e;
    mostrarBarra();
  });
  window.addEventListener('appinstalled', function () {
    aviso = null;
    if (barra) barra.hidden = true;
    if (seccion) seccion.hidden = true;
  });
  if (boton) boton.addEventListener('click', instalar);
  var si = document.getElementById('aviso-si');
  var no = document.getElementById('aviso-no');
  if (si) si.addEventListener('click', instalar);
  if (no) no.addEventListener('click', cerrarBarra);
})();
