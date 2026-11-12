/* National Reform Movement — site behaviour (no dependencies) */
(function () {
  'use strict';

  /* ---- Settings: fill these in when available ---- */
  var EMAIL = '';                         // e.g. 'office@example.com' — the email button appears once set
  var PORTRAIT = 'assets/portrait.jpg';   // drop a photo at this path and it replaces the logo in the Nasser Al-Senussi section

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('.site-header');
  var TITLES = {
    ar: 'التيار الوطني الإصلاحي | المواطن أولاً',
    en: 'National Reform Movement | Citizens first'
  };

  /* ---- Language ---- */
  function applyLang(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = TITLES[lang];
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  function setLang(lang, animate) {
    if (!animate) { applyLang(lang); return; }
    body.classList.add('lang-fade');
    setTimeout(function () {
      applyLang(lang);
      body.classList.remove('lang-fade');
    }, 220);
  }
  document.querySelectorAll('.lang').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(root.lang === 'ar' ? 'en' : 'ar', true);
    });
  });

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
  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Scroll: thread progress + header behaviour ---- */
  var thread = document.querySelector('.thread i');
  var lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    thread.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', y > 24);
    header.classList.toggle('hide', y > lastY && y > 320);
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

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
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          a.classList.add('active');
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
  var probe = new Image();
  probe.onload = function () {
    var frame = document.querySelector('.portrait');
    probe.alt = '';
    probe.className = 'photo';
    root.classList.add('has-photo');
    frame.appendChild(probe);
  };
  probe.src = PORTRAIT;

  /* ---- Start the hero sequence once fonts are in ---- */
  function ready() { requestAnimationFrame(function () { root.classList.add('ready'); }); }
  if (document.fonts && document.fonts.ready) {
    var done = false;
    var go = function () { if (!done) { done = true; ready(); } };
    document.fonts.ready.then(go);
    setTimeout(go, 1200);
  } else { ready(); }
})();
