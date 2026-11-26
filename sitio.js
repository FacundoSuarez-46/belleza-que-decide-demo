  window.BQD = window.BQD || {};
  window.BQD.wa = function(texto){
    return 'https://wa.me/59899365404?text=' + encodeURIComponent(texto);
  };

  (function(){
    document.documentElement.classList.add('js');
    document.querySelectorAll('details').forEach(function(det){
      var sum = det.querySelector('summary');
      if (!sum) return;
      function marcar(){ sum.setAttribute('aria-expanded', det.open ? 'true' : 'false'); }
      marcar();
      det.addEventListener('toggle', marcar);
    });

    (function mastScroll(){
      var mast = document.querySelector('.mast');
      if (!mast) return;
      function tick(){
        if (window.scrollY > 8) mast.classList.add('is-scrolled');
        else mast.classList.remove('is-scrolled');
      }
      tick();
      window.addEventListener('scroll', tick, {passive:true});
    })();

    (function sumateActual(){
      var link = document.querySelector('.mast-sumate');
      var equipo = document.getElementById('equipo');
      if (!link || !equipo) return;
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }, {threshold: 0.4});
      io.observe(equipo);
    })();

    (function renderOfertas(){
      var data = window.OFERTAS;
      if (!data || !data.length) return;

      function armar(item, etiqueta){
        var nodo = document.createElement(etiqueta);
        if (etiqueta === 'button') nodo.type = 'button';
        nodo.className = 'v-card';
        nodo.setAttribute('data-id', item.id);
        nodo.setAttribute('data-kicker', item.kicker || '');
        if (item.sirve) nodo.setAttribute('data-sirve', item.sirve);
        if (item.lineas) nodo.setAttribute('data-lineas', item.lineas);
        if (item.texto) nodo.setAttribute('data-texto', item.texto);
        var figura = document.createElement('figure');
        var img = document.createElement('img');
        img.src = item.img;
        img.alt = item.nombre;
        figura.appendChild(img);
        var nombre = document.createElement('span');
        nombre.className = 'v-nombre';
        nombre.textContent = item.nombre;
        nodo.appendChild(figura);
        nodo.appendChild(nombre);
        if (etiqueta === 'a') {
          var ver = document.createElement('span');
          ver.className = 'v-ver';
          ver.textContent = item.campana ? 'Ver la campaña' : 'Ver detalles';
          nodo.appendChild(ver);
        }
        return nodo;
      }

      var track = document.querySelector('.vitrina-track');
      if (track) {
        var grupo = '';
        data.forEach(function(item){
          if (item.grupo !== grupo) {
            grupo = item.grupo;
            var sep = document.createElement('li');
            sep.className = 'v-sep';
            sep.setAttribute('aria-hidden', 'true');
            var span = document.createElement('span');
            span.textContent = grupo;
            sep.appendChild(span);
            track.appendChild(sep);
          }
          var li = document.createElement('li');
          li.appendChild(armar(item, 'button'));
          track.appendChild(li);
        });
      }

      var home = document.getElementById('destacados');
      if (home) {
        data.forEach(function(item){
          if (!item.home) return;
          var link = armar(item, 'a');
          link.href = './tocador.html?pieza=' + encodeURIComponent(item.id) + '#vitrina';
          home.appendChild(link);
        });
      }
    })();

    var escena = { heroVisto: false, heroPausa: false, sumateActivo: false };

    (function heroFilm(){
      var photo = document.querySelector('.photo');
      var film = document.querySelector('.hero-film');
      var boton = document.getElementById('hero-pausa');
      if (!photo || !film) return;
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        if (boton) boton.hidden = true;
        return;
      }

      film.setAttribute('webkit-playsinline', '');
      function play(){
        if (escena.heroPausa || escena.sumateActivo || document.hidden || !escena.heroVisto) return;
        var p = film.play();
        if (p && p.catch) p.catch(function(){});
      }
      function load(){
        var src = './img/hero-16x9.mp4?v=16';
        if (film.getAttribute('data-src') === src) return;
        film.setAttribute('data-src', src);
        film.src = src;
        film.load();
      }
      function etiqueta(){
        if (!boton) return;
        var pausado = film.paused || escena.heroPausa;
        boton.classList.toggle('is-off', pausado);
        boton.setAttribute('aria-label', pausado ? 'Reproducir el video' : 'Pausar el video');
        boton.setAttribute('aria-pressed', pausado ? 'false' : 'true');
      }

      film.addEventListener('playing', function(){
        photo.classList.add('is-live');
        etiqueta();
      });
      film.addEventListener('pause', etiqueta);

      var vis = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          escena.heroVisto = entry.isIntersecting;
          if (entry.isIntersecting) { load(); play(); }
          else film.pause();
        });
      }, {threshold: 0.2});
      vis.observe(photo);

      document.addEventListener('visibilitychange', function(){
        if (document.hidden) film.pause();
        else play();
      });
      if (boton) boton.addEventListener('click', function(){
        var sumate = document.getElementById('sumate-video');
        if (film.paused) {
          escena.heroPausa = false;
          escena.sumateActivo = false;
          if (sumate && !sumate.paused) sumate.pause();
          load();
          var p = film.play();
          if (p && p.catch) p.catch(function(){});
        } else {
          escena.heroPausa = true;
          film.pause();
        }
        etiqueta();
      });
    })();

    (function labialFilm(){
      var frame = document.querySelector('.deseo-frame');
      var film = document.querySelector('.labial-film');
      var boton = document.getElementById('labial-pausa');
      if (!frame || !film) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (boton) boton.hidden = true;
        return;
      }
      var pausaManual = false;
      var visto = false;
      film.setAttribute('webkit-playsinline', '');
      film.src = './img/labial.mp4?v=18';
      function play(){
        if (pausaManual || document.hidden || !visto) return;
        var p = film.play();
        if (p && p.catch) p.catch(function(){});
      }
      function etiqueta(){
        if (!boton) return;
        var pausado = film.paused || pausaManual;
        boton.classList.toggle('is-off', pausado);
        boton.setAttribute('aria-label', pausado ? 'Reproducir el video' : 'Pausar el video');
        boton.setAttribute('aria-pressed', pausado ? 'false' : 'true');
      }
      film.addEventListener('playing', function(){ frame.classList.add('is-live'); etiqueta(); });
      film.addEventListener('pause', etiqueta);
      var vis = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          visto = entry.isIntersecting;
          if (visto) play();
          else film.pause();
        });
      }, {threshold: 0.35});
      vis.observe(frame);
      document.addEventListener('visibilitychange', function(){
        if (document.hidden) film.pause();
        else play();
      });
      if (boton) boton.addEventListener('click', function(){
        if (film.paused) { pausaManual = false; visto = true; var p = film.play(); if (p && p.catch) p.catch(function(){}); }
        else { pausaManual = true; film.pause(); }
        etiqueta();
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

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});
      document.querySelectorAll('.reveal, .entra, .exp-amigas').forEach(function(el){ io.observe(el); });
      document.querySelectorAll('.entra .uni').forEach(function(el, i){
        el.style.setProperty('--i', String(i));
      });
    } else {
      document.querySelectorAll('.reveal, .entra, .exp-amigas').forEach(function(el){ el.classList.add('is-in'); });
    }

    (function relato(){
      if (reduceMotion) return;
      var mover = document.querySelector('.exp-amigas .mover');
      if (!mover) return;
      var figura = mover.parentElement;
      var activo = false;
      var pedido = false;
      new IntersectionObserver(function(entries){
        activo = entries[0].isIntersecting;
        if (activo) pintar();
      }, {threshold: 0}).observe(figura);
      function pintar(){
        pedido = false;
        if (!activo) return;
        var caja = figura.getBoundingClientRect();
        var centro = (caja.top + caja.height / 2) / window.innerHeight - 0.5;
        var y = Math.max(-16, Math.min(16, centro * -20));
        mover.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      }
      window.addEventListener('scroll', function(){
        if (!activo || pedido) return;
        pedido = true;
        requestAnimationFrame(pintar);
      }, {passive: true});
    })();

    (function videoSumate(){
      var cine = document.getElementById('sumate-cine');
      var video = document.getElementById('sumate-video');
      var grande = document.getElementById('sumate-play');
      var toggle = document.getElementById('sumate-toggle');
      var barra = document.getElementById('sumate-progreso');
      var tiempo = document.getElementById('sumate-tiempo');
      var sonido = document.getElementById('sumate-sonido');
      if (!cine || !video) return;
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      var listo = false;
      var pausaManual = false;
      var arrastrando = false;
      var visto = false;

      function clock(seg){
        if (!isFinite(seg)) seg = 0;
        var m = Math.floor(seg / 60);
        var s = Math.floor(seg % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
      }
      function pintarTiempo(){
        var total = video.duration || 217;
        if (tiempo) tiempo.textContent = clock(video.currentTime) + ' / ' + clock(total);
        if (barra && !arrastrando && total) {
          var valor = Math.round((video.currentTime / total) * 1000);
          barra.value = String(valor);
          barra.setAttribute('aria-valuenow', String(valor));
        }
      }
      function cargar(){
        if (listo) return;
        listo = true;
        video.src = './img/sumate.mp4';
        video.load();
      }
      function puedeSeguir(){
        return !pausaManual && !video.ended && !document.hidden && visto;
      }
      function reproducir(){
        cargar();
        escena.sumateActivo = true;
        var hero = document.querySelector('.hero-film');
        if (hero) hero.pause();
        var p = video.play();
        if (p && p.catch) p.catch(function(){
          cine.classList.remove('is-playing');
          escena.sumateActivo = false;
        });
      }
      function pausarPorSalir(){
        if (!video.paused) video.pause();
        escena.sumateActivo = false;
        var hero = document.querySelector('.hero-film');
        if (hero && escena.heroVisto && !escena.heroPausa && !document.hidden) {
          var sigue = hero.play();
          if (sigue && sigue.catch) sigue.catch(function(){});
        }
      }
      function sync(){
        var anda = !video.paused && !video.ended;
        cine.classList.toggle('is-playing', anda);
        if (toggle) {
          toggle.classList.toggle('is-off', !anda);
          toggle.setAttribute('aria-label', anda ? 'Pausar el video' : (video.ended ? 'Repetir el video' : 'Reproducir el video'));
        }
        if (sonido) {
          sonido.classList.toggle('is-on', !video.muted);
          sonido.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
          sonido.setAttribute('aria-label', video.muted ? 'Activar el sonido' : 'Silenciar el video');
        }
      }

      video.addEventListener('loadedmetadata', pintarTiempo);
      video.addEventListener('timeupdate', pintarTiempo);
      video.addEventListener('play', sync);
      video.addEventListener('pause', function(){
        if (video.ended) pausaManual = true;
        escena.sumateActivo = !video.paused && !video.ended;
        sync();
      });
      video.addEventListener('ended', function(){
        pausaManual = true;
        escena.sumateActivo = false;
        sync();
        pintarTiempo();
      });

      function alternar(){
        if (video.ended) {
          pausaManual = false;
          video.currentTime = 0;
          reproducir();
          return;
        }
        if (video.paused) {
          pausaManual = false;
          reproducir();
        } else {
          pausaManual = true;
          video.pause();
          pausarPorSalir();
        }
      }
      if (grande) grande.addEventListener('click', alternar);
      if (toggle) toggle.addEventListener('click', alternar);
      if (sonido) sonido.addEventListener('click', function(){
        video.muted = !video.muted;
        sync();
      });
      var pantalla = document.getElementById('sumate-full');
      if (pantalla) pantalla.addEventListener('click', function(){
        if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        else if (video.requestFullscreen) video.requestFullscreen();
        else if (cine.requestFullscreen) cine.requestFullscreen();
      });
      if (barra) {
        barra.addEventListener('pointerdown', function(){ arrastrando = true; });
        barra.addEventListener('pointerup', function(){ arrastrando = false; });
        barra.addEventListener('input', function(){
          cargar();
          var total = video.duration || 217;
          video.currentTime = (Number(barra.value) / 1000) * total;
          pintarTiempo();
        });
      }

      new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          visto = entry.intersectionRatio >= 0.6;
          if (visto && puedeSeguir() && !reduceMotion) reproducir();
          else if (!entry.isIntersecting) pausarPorSalir();
        });
      }, {threshold: [0, 0.6]}).observe(cine);

      document.addEventListener('visibilitychange', function(){
        if (document.hidden) {
          if (!video.paused) video.pause();
          escena.sumateActivo = false;
        } else if (puedeSeguir() && !reduceMotion) {
          reproducir();
        }
      });
      sync();
    })();

    (function vitrina(){
      var rail = document.querySelector('.vitrina-rail');
      var ficha = document.getElementById('ficha');
      if (!rail || !ficha || !ficha.showModal) return;
      var cards = Array.prototype.slice.call(rail.querySelectorAll('.v-card'));
      var puntos = document.getElementById('vitrina-puntos');
      var foto = document.getElementById('ficha-foto');
      var img = document.getElementById('ficha-img');
      var nombre = document.getElementById('ficha-nombre');
      var kicker = document.getElementById('ficha-kicker');
      var sirve = document.getElementById('ficha-sirve');
      var etiqSirve = document.getElementById('ficha-etiq-sirve');
      var lineas = document.getElementById('ficha-lineas');
      var etiqLineas = document.getElementById('ficha-etiq-lineas');
      var texto = document.getElementById('ficha-texto');
      var vacio = document.getElementById('ficha-vacio');
      var wa = document.getElementById('ficha-wa');
      var compartir = document.getElementById('ficha-compartir');
      var piezaActual = '';
      var cerrar = document.getElementById('ficha-cerrar');
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function reintentar(imagen){
        if (!imagen || imagen.dataset.reintento) return;
        imagen.dataset.reintento = '1';
        var limpio = (imagen.getAttribute('src') || '').split('?')[0];
        if (!limpio) return;
        imagen.src = limpio + '?r=' + Date.now();
      }
      cards.forEach(function(card, i){
        card.style.setProperty('--i', String(i));
        card.addEventListener('click', function(){ abrir(card); });
        var foto = card.querySelector('img');
        if (foto) foto.addEventListener('error', function(){ reintentar(foto); });
      });
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('controllerchange', function(){
          cards.forEach(function(card){
            var foto = card.querySelector('img');
            if (foto && !foto.naturalWidth) reintentar(foto);
          });
        });
      }

      if (!reduce) {
        var visto = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            visto.unobserve(entry.target);
          });
        }, {threshold: 0.2});
        var banda = document.getElementById('vitrina');
        if (banda) visto.observe(banda);
      } else {
        var bandaFija = document.getElementById('vitrina');
        if (bandaFija) bandaFija.classList.add('is-in');
      }

      if (puntos) {
        cards.forEach(function(card, i){
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', card.querySelector('.v-nombre').textContent);
          dot.addEventListener('click', function(){
            card.scrollIntoView({inline: 'start', block: 'nearest', behavior: reduce ? 'auto' : 'smooth'});
          });
          puntos.appendChild(dot);
        });
        var marcas = puntos.querySelectorAll('button');
        function marcar(){
          var base = rail.getBoundingClientRect().left + 24;
          var activo = 0;
          cards.forEach(function(card, i){
            if (card.getBoundingClientRect().left <= base) activo = i;
          });
          marcas.forEach(function(dot, i){
            if (i === activo) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
          });
        }
        marcar();
        rail.addEventListener('scroll', marcar, {passive: true});
      }

      function campo(el, etiq, valor){
        if (!el) return;
        if (valor) {
          el.hidden = false;
          if (etiq) etiq.hidden = false;
          el.textContent = valor;
        } else {
          el.hidden = true;
          if (etiq) etiq.hidden = true;
          el.textContent = '';
        }
      }

      function abrir(card){
        var pic = card.querySelector('img');
        var titulo = card.querySelector('.v-nombre').textContent.trim();
        piezaActual = card.getAttribute('data-id') || '';
        window.BQD = window.BQD || {};
        window.BQD.piezaAbierta = piezaActual;
        img.src = pic.getAttribute('src');
        img.alt = titulo;
        nombre.textContent = titulo;
        kicker.textContent = card.getAttribute('data-kicker') || 'Este mes';
        campo(sirve, etiqSirve, card.getAttribute('data-sirve') || '');
        campo(texto, null, card.getAttribute('data-texto') || '');
        lineas.innerHTML = '';
        var partes = (card.getAttribute('data-lineas') || '').split('|').map(function(s){ return s.trim(); }).filter(Boolean);
        if (partes.length) {
          lineas.hidden = false;
          etiqLineas.hidden = false;
          partes.forEach(function(parte){
            var li = document.createElement('li');
            li.textContent = parte;
            lineas.appendChild(li);
          });
        } else {
          lineas.hidden = true;
          etiqLineas.hidden = true;
        }
        if (vacio) vacio.hidden = !!(card.getAttribute('data-sirve') || card.getAttribute('data-texto') || partes.length);
        wa.href = window.BQD.wa('¡Hola! Estuve visitando Belleza que Decide y me interesa conocer más sobre ' + titulo + '. ¿Podrías asesorarme?');
        if (compartir) compartir.textContent = 'Compartir';
        ficha.classList.remove('is-sangre');
        if (!ficha.open) ficha.showModal();
      }

      function cerrarFicha(){
        ficha.classList.remove('is-sangre');
        if (ficha.open) ficha.close();
      }

      if (compartir) compartir.addEventListener('click', function(){
        var url = new URL('./tocador.html', window.location.href);
        url.searchParams.set('pieza', piezaActual);
        url.hash = 'vitrina';
        var enlace = url.href;
        var tituloShare = nombre.textContent;
        var texto = 'Mirá ' + tituloShare + ' en Belleza que Decide.';
        function copiado(){ compartir.textContent = 'Enlace copiado'; }
        if (navigator.share) {
          navigator.share({title: tituloShare, text: texto, url: enlace}).catch(function(err){
            if (err && err.name === 'AbortError') return;
            if (navigator.clipboard) navigator.clipboard.writeText(enlace).then(copiado).catch(function(){});
          });
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(enlace).then(copiado).catch(function(){});
        }
      });
      if (cerrar) cerrar.addEventListener('click', cerrarFicha);
      if (foto) foto.addEventListener('click', function(){ ficha.classList.toggle('is-sangre'); });
      ficha.addEventListener('click', function(e){
        if (e.target === ficha) cerrarFicha();
      });
      ficha.addEventListener('close', function(){ ficha.classList.remove('is-sangre'); });

      var pieza = '';
      try {
        var params = new URLSearchParams(window.location.search);
        pieza = params.get('pieza') || params.get('producto') || '';
      } catch (err) {}
      if (pieza) {
        cards.forEach(function(card){
          if (card.getAttribute('data-id') === pieza) abrir(card);
        });
      }
    })();

    (function guia(){
      var intro = document.getElementById('guia-intro');
      var panel = document.getElementById('guia-panel');
      var cuerpo = document.getElementById('guia-cuerpo');
      var pasoEl = document.getElementById('guia-paso');
      var barra = document.getElementById('guia-barra');
      var abrirBtn = document.getElementById('guia-abrir');
      var cerrar = document.getElementById('guia-cerrar');
      var atras = document.getElementById('guia-atras');
      var sigue = document.getElementById('guia-sigue');
      var nav = document.getElementById('guia-nav');
      if (!intro || !panel || !cuerpo || !sigue) return;
      var estado = { paso: 0, modo: '', lugar: '', intereses: [] };
      var lista = [
        {id:'piel', label:'Cuidado de la piel'},
        {id:'maquillaje', label:'Maquillaje'},
        {id:'fragancias', label:'Fragancias'},
        {id:'cuerpo', label:'Manos y cuerpo'},
        {id:'todo', label:'Un poco de todo'}
      ];
      function reset(){ estado = { paso: 0, modo: '', lugar: '', intereses: [] }; }
      function cerrarGuia(){ panel.hidden = true; intro.hidden = false; reset(); }
      function opciones(titulo, items, actual, multiple){
        cuerpo.innerHTML = '';
        var h = document.createElement('h3');
        h.id = 'guia-pregunta';
        h.textContent = titulo;
        cuerpo.appendChild(h);
        var caja = document.createElement('div');
        caja.className = 'guia-opciones';
        caja.setAttribute('role', 'group');
        caja.setAttribute('aria-labelledby', 'guia-pregunta');
        items.forEach(function(item){
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'guia-op';
          b.textContent = item.label;
          var on = multiple ? estado.intereses.indexOf(item.id) !== -1 : actual === item.id;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.addEventListener('click', function(){
            if (!multiple) {
              if (estado.paso === 0) estado.modo = item.id;
              else estado.lugar = item.id;
            } else if (item.id === 'todo') {
              estado.intereses = ['todo'];
            } else {
              estado.intereses = estado.intereses.filter(function(x){ return x !== 'todo'; });
              var i = estado.intereses.indexOf(item.id);
              if (i === -1) estado.intereses.push(item.id);
              else estado.intereses.splice(i, 1);
            }
            pintar();
          });
          caja.appendChild(b);
        });
        cuerpo.appendChild(caja);
      }
      function nombres(){
        if (estado.intereses.indexOf('todo') !== -1) return 'un poco de todo';
        return estado.intereses.map(function(id){
          var item = lista.filter(function(x){ return x.id === id; })[0];
          return item ? item.label.toLowerCase() : id;
        }).join(', ');
      }
      function mensaje(){
        var modo = estado.modo === 'sola' ? 'una experiencia individual' : 'una experiencia con amigas';
        var lugar = estado.lugar === 'casa' ? 'en una casa' : (estado.lugar === 'coordinar' ? 'en el lugar que podamos coordinar' : 'en la oficina de Young');
        return '¡Hola! Estuve visitando Belleza que Decide y me gustaría coordinar una experiencia de belleza gratuita. Me interesa ' + modo + ', ' + lugar + ', principalmente para ' + nombres() + '. ¿Podemos coordinar un horario?';
      }
      function pintar(){
        intro.hidden = true;
        panel.hidden = false;
        if (nav) nav.hidden = estado.paso > 2;
        if (barra) barra.style.width = ['33%','66%','100%','100%'][estado.paso] || '33%';
        if (atras) atras.hidden = estado.paso === 0;
        if (estado.paso === 0) {
          if (pasoEl) pasoEl.textContent = 'Paso 1 de 3';
          sigue.textContent = 'Continuar';
          opciones('¿Cómo te gustaría disfrutarla?', [
            {id:'sola', label:'Un momento para mí'},
            {id:'amigas', label:'Con mis amigas'}
          ], estado.modo, false);
          sigue.disabled = !estado.modo;
        } else if (estado.paso === 1) {
          if (pasoEl) pasoEl.textContent = 'Paso 2 de 3';
          sigue.textContent = 'Continuar';
          if (estado.modo === 'sola') {
            estado.lugar = 'oficina';
            cuerpo.innerHTML = '<h3 id="guia-pregunta">El facial es en la oficina.</h3><p>En Young, de a una. El horario lo coordinamos por WhatsApp.</p>';
            sigue.disabled = false;
          } else {
            opciones('¿Dónde preferís realizarla?', [
              {id:'oficina', label:'En la oficina, en Young'},
              {id:'casa', label:'En casa, con amigas'},
              {id:'coordinar', label:'Prefiero coordinarlo'}
            ], estado.lugar, false);
            sigue.disabled = !estado.lugar;
          }
        } else if (estado.paso === 2) {
          if (pasoEl) pasoEl.textContent = 'Paso 3 de 3';
          sigue.textContent = 'Ver mi experiencia';
          opciones('¿Qué te gustaría descubrir?', lista, '', true);
          sigue.disabled = !estado.intereses.length;
        } else {
          if (pasoEl) pasoEl.textContent = 'Tu experiencia';
          var titulo = estado.modo === 'sola' ? 'Tu momento personal.' : 'Belleza entre amigas.';
          var lugarTxt = estado.lugar === 'casa' ? 'En una casa' : (estado.lugar === 'coordinar' ? 'Lugar a coordinar' : 'En la oficina, en Young');
          var tiempo = estado.modo === 'sola' ? '45 minutos' : 'De 1 hora a 1 hora y media';
          cuerpo.innerHTML = '';
          var box = document.createElement('div');
          box.className = 'guia-resultado';
          var h = document.createElement('h3');
          h.textContent = titulo;
          var p = document.createElement('p');
          p.textContent = 'Es gratuita y no hay obligación de compra. El horario lo vemos juntas.';
          var ul = document.createElement('ul');
          [tiempo, lugarTxt, nombres()].forEach(function(linea){
            var li = document.createElement('li');
            li.textContent = linea;
            ul.appendChild(li);
          });
          var a = document.createElement('a');
          a.className = 'btn';
          a.target = '_blank';
          a.rel = 'noopener';
          a.href = window.BQD.wa(mensaje());
          a.textContent = 'Coordiná tu experiencia por WhatsApp';
          var again = document.createElement('button');
          again.type = 'button';
          again.className = 'text-link';
          again.textContent = 'Empezar de nuevo';
          again.addEventListener('click', function(){ reset(); pintar(); });
          box.appendChild(h);
          box.appendChild(p);
          box.appendChild(ul);
          box.appendChild(a);
          box.appendChild(again);
          cuerpo.appendChild(box);
        }
      }
      if (abrirBtn) abrirBtn.addEventListener('click', function(){ reset(); pintar(); });
      if (cerrar) cerrar.addEventListener('click', cerrarGuia);
      if (atras) atras.addEventListener('click', function(){
        if (estado.paso === 1 && estado.modo !== 'sola') estado.lugar = '';
        if (estado.paso > 0 && estado.paso < 3) estado.paso -= 1;
        else if (estado.paso === 3) estado.paso = 2;
        pintar();
      });
      if (sigue) sigue.addEventListener('click', function(){
        if (sigue.disabled) return;
        estado.paso = estado.paso < 2 ? estado.paso + 1 : 3;
        pintar();
      });
    })();

    (function compartirCasa(){
      var btn = document.getElementById('compartir-casa');
      if (!btn) return;
      btn.addEventListener('click', function(){
        var url = new URL('./', window.location.href);
        url.hash = 'anfitrionas';
        var enlace = url.href;
        if (navigator.share) {
          navigator.share({title:'Belleza que Decide', text:'Una experiencia de belleza en casa, con amigas.', url:enlace}).catch(function(err){
            if (err && err.name === 'AbortError') return;
          });
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(enlace).then(function(){ btn.textContent = 'Enlace copiado'; }).catch(function(){});
        }
      });
    })();

    window.BQD.montarRegalos = function(){
      var campana = window.CAMPANA || {};
      if (campana.activa !== 'navidad' || !campana.navidad || campana.navidad.lista !== true) return;
      if (document.getElementById('regalos')) return;
      var datos = window.OFERTAS || [];
      var estado = { para: '', tipo: '' };
      var quienes = [
        {id:'mama', label:'Para mamá'},
        {id:'amiga', label:'Para una amiga'},
        {id:'especial', label:'Para alguien especial'},
        {id:'mi', label:'Para mí'},
        {id:'nose', label:'Todavía no lo sé'}
      ];
      var tipos = [
        {id:'fragancias', label:'Fragancias', grupo:'Fragancias'},
        {id:'maquillaje', label:'Maquillaje', grupo:'Labios'},
        {id:'piel', label:'Cuidado de la piel', grupo:'Piel'},
        {id:'cuerpo', label:'Manos y cuerpo', grupo:'Cuerpo'},
        {id:'descubrir', label:'Quiero descubrir opciones', grupo:''}
      ];
      var sec = document.createElement('section');
      sec.className = 'guia';
      sec.id = 'regalos';
      sec.innerHTML = '<div class="ancho"><p class="folio"><span>' + campana.navidad.titulo + '</span></p><h2>' + campana.navidad.texto + '</h2><div id="regalos-cuerpo"></div></div>';
      var pie = document.querySelector('.pie');
      if (pie) pie.parentNode.insertBefore(sec, pie);
      else document.body.appendChild(sec);
      var caja = sec.querySelector('#regalos-cuerpo');
      function botones(items, actual, elegir){
        var wrap = document.createElement('div');
        wrap.className = 'guia-opciones';
        items.forEach(function(item){
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'guia-op';
          b.textContent = item.label;
          b.setAttribute('aria-pressed', actual === item.id ? 'true' : 'false');
          b.addEventListener('click', function(){ elegir(item.id); pintar(); });
          wrap.appendChild(b);
        });
        return wrap;
      }
      function pintar(){
        caja.innerHTML = '';
        if (!estado.para) {
          var h = document.createElement('h3');
          h.textContent = '¿Para quién estás buscando un regalo?';
          caja.appendChild(h);
          caja.appendChild(botones(quienes, estado.para, function(id){ estado.para = id; }));
          return;
        }
        if (!estado.tipo) {
          var h2 = document.createElement('h3');
          h2.textContent = '¿Qué tipo de regalo estás buscando?';
          caja.appendChild(h2);
          caja.appendChild(botones(tipos, estado.tipo, function(id){ estado.tipo = id; }));
          return;
        }
        var tipo = tipos.filter(function(t){ return t.id === estado.tipo; })[0];
        var quien = quienes.filter(function(q){ return q.id === estado.para; })[0];
        var lista = datos.filter(function(item){ return !tipo.grupo || item.grupo === tipo.grupo; }).slice(0, 4);
        var h3 = document.createElement('h3');
        h3.textContent = lista.length ? 'Estas opciones pueden servir.' : 'Mejor lo vemos juntas.';
        caja.appendChild(h3);
        if (!lista.length) {
          var p = document.createElement('p');
          p.textContent = 'No hay una pieza de ese grupo en la selección de este mes.';
          caja.appendChild(p);
        }
        lista.forEach(function(item){
          var a = document.createElement('a');
          a.className = 'text-link';
          a.href = './tocador.html?pieza=' + encodeURIComponent(item.id) + '#vitrina';
          a.textContent = item.nombre;
          caja.appendChild(a);
        });
        var wa = document.createElement('a');
        wa.className = 'btn';
        wa.target = '_blank';
        wa.rel = 'noopener';
        wa.href = window.BQD.wa('¡Hola! Estoy buscando un regalo y me gustaría recibir algunas recomendaciones. ' + (quien ? quien.label : '') + '. Me interesan principalmente: ' + (tipo ? tipo.label.toLowerCase() : 'ver opciones') + '.');
        wa.textContent = 'Pedir una recomendación';
        caja.appendChild(wa);
      }
      pintar();
    };
    window.BQD.montarRegalos();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js?v=31');
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

    function cerrarBarra(){
      try { localStorage.setItem(clave, 'no'); } catch (err) {}
      if (barra) barra.hidden = true;
      document.body.classList.remove('has-aviso');
    }
    function mostrarBarra(){
      var guardado = '';
      try { guardado = localStorage.getItem(clave) || ''; } catch (err) {}
      if (guardado === 'no') return;
      if (barra) barra.hidden = false;
      document.body.classList.add('has-aviso');
    }
    function instalar(){
      if (aviso) {
        aviso.prompt();
        aviso.userChoice.finally(function(){ aviso = null; if (barra) barra.hidden = true; document.body.classList.remove('has-aviso'); });
        return;
      }
      window.location.href = './instalar.html';
    }

    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault();
      aviso = e;
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
