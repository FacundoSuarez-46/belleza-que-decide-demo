  (function(){
    document.documentElement.classList.add('js');

    (function heroFilm(){
      var photo = document.querySelector('.photo');
      var film = document.querySelector('.hero-film');
      if (!photo || !film) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      film.setAttribute('webkit-playsinline', '');
      var desktop = window.matchMedia('(min-width: 900px)');
      function file(){ return './img/hero-16x9.mp4?v=16'; }
      function play(){ var p = film.play(); if (p && p.catch) p.catch(function(){}); }
      function load(){
        var src = file();
        if (film.getAttribute('data-src') === src) return;
        film.setAttribute('data-src', src);
        photo.classList.remove('is-live');
        film.src = src;
        film.load();
      }

      film.addEventListener('playing', function(){ photo.classList.add('is-live'); });

      var vis = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) { load(); play(); }
          else film.pause();
        });
      }, {threshold: 0.18});
      vis.observe(photo);

      document.addEventListener('visibilitychange', function(){
        if (document.hidden) film.pause();
        else if (film.getAttribute('data-src')) play();
      });
      if (desktop.addEventListener) desktop.addEventListener('change', function(){ load(); play(); });
    })();

    (function labialFilm(){
      var frame = document.querySelector('.deseo-frame');
      var film = document.querySelector('.labial-film');
      if (!frame || !film) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      film.setAttribute('webkit-playsinline', '');
      film.src = './img/labial.mp4?v=18';
      function play(){ var p = film.play(); if (p && p.catch) p.catch(function(){}); }
      film.addEventListener('playing', function(){ frame.classList.add('is-live'); });
      var vis = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) play();
          else film.pause();
        });
      }, {threshold: 0.35});
      vis.observe(frame);
      document.addEventListener('visibilitychange', function(){
        if (document.hidden) film.pause();
        else play();
      });
    })();

    var indice = document.querySelectorAll('.indice a');
    if (indice.length) {
      var caps = ['piel','color','perfume','cuerpo'];
      function mark(){
        var mid = window.innerHeight * 0.35, current = 'piel';
        caps.forEach(function(id){
          var el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= mid) current = id;
        });
        indice.forEach(function(a){
          if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current','true');
          else a.removeAttribute('aria-current');
        });
      }
      mark();
      window.addEventListener('scroll', mark, {passive:true});
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});
      document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js?v=22');
    }

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

    var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    function cerrarBarra(){
      try { localStorage.setItem(clave, 'no'); } catch (err) {}
      if (barra) barra.hidden = true;
    }
    function mostrarBarra(){
      var guardado = '';
      try { guardado = localStorage.getItem(clave) || ''; } catch (err) {}
      if (guardado === 'no') return;
      if (barra) barra.hidden = false;
    }
    function instalar(){
      if (aviso) {
        aviso.prompt();
        aviso.userChoice.finally(function(){ aviso = null; if (barra) barra.hidden = true; });
        return;
      }
      window.location.href = './instalar.html';
    }

    if (esIOS) mostrarBarra();
    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault();
      aviso = e;
      mostrarBarra();
    });
    window.addEventListener('appinstalled', function(){
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
