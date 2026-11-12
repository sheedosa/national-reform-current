/* National Reform Movement — site behaviour (no dependencies) */
(function () {
  'use strict';

  /* ---- Settings: fill these in when available ---- */
  var EMAIL = '';     // e.g. 'office@example.com' — the email button appears once set
  var PORTRAIT = '';  // e.g. 'assets/portrait.jpg' — shows a photo in the Nasser Al-Senussi section

  var root = document.documentElement;
  var base = root.getAttribute('data-base') || './';
  var header = document.querySelector('.site-header');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Language switch: short fade, then go to the other page ---- */
  var sw = document.querySelector('a.lang');
  if (sw && !reduce) {
    sw.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      document.body.classList.add('lang-fade');
      var href = sw.href + location.hash;
      setTimeout(function () { location.href = href; }, 180);
    });
  }
  window.addEventListener('pageshow', function () { document.body.classList.remove('lang-fade'); });

  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector('.menu-btn');
  function closeMenu() {
    root.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = root.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---- Scroll: progress line + header (layout read once, not per frame) ---- */
  var thread = document.querySelector('.thread i');
  var max = 1, lastY = 0, ticking = false;
  function measure() { max = Math.max(1, root.scrollHeight - window.innerHeight); }
  function onScroll() {
    var y = window.scrollY;
    thread.style.transform = 'scaleY(' + Math.min(1, y / max).toFixed(4) + ')';
    header.classList.toggle('scrolled', y > 24);
    header.classList.toggle('hide', y > lastY && y > 320 && !root.classList.contains('menu-open'));
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  window.addEventListener('load', measure);
  requestAnimationFrame(function () { measure(); onScroll(); });

  /* ---- Reveal on scroll + active nav link ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var links = {};
    document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (a && en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); links[k].removeAttribute('aria-current'); });
          a.classList.add('active');
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Optional email + portrait ---- */
  if (EMAIL) {
    var mail = document.getElementById('mail');
    mail.href = 'mailto:' + EMAIL;
    mail.hidden = false;
  }
  if (PORTRAIT) {
    var img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.className = 'photo';
    img.onload = function () {
      document.querySelector('.portrait').appendChild(img);
      root.classList.add('has-photo');
    };
    img.src = base + PORTRAIT;
  }

  /* ---- Start the hero sequence once fonts are in ---- */
  function ready() { requestAnimationFrame(function () { root.classList.add('ready'); }); }
  if (document.fonts && document.fonts.ready) {
    var done = false;
    var go = function () { if (!done) { done = true; ready(); } };
    document.fonts.ready.then(go);
    setTimeout(go, 900);
  } else { ready(); }
})();
