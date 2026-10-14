/* 연세아폴로여성의원 — 공통 JavaScript */
(function () {
  'use strict';

  /* 1. Header shadow on scroll */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    var st = document.getElementById('scrollTop');
    if (st) st.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. Mobile nav */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('mobileNav');
  var overlay = document.getElementById('mobileNavOverlay');
  var closeBtn = document.getElementById('mobileNavClose');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    overlay && overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger && hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  hamburger && hamburger.addEventListener('click', function () { setNav(true); });
  closeBtn && closeBtn.addEventListener('click', function () { setNav(false); });
  overlay && overlay.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  if (nav) nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* 3. Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* 4. FAQ accordion */
  var faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = item.classList.contains('open');
      faqs.forEach(function (f) {
        f.classList.remove('open');
        var b = f.querySelector('.faq-q'); b && b.setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* 5. Smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* 6. Scroll to top */
  var st = document.getElementById('scrollTop');
  st && st.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 7. Today's hours + open/closed status (Asia/Seoul) */
  // 평일 09:30-19:00 (점심 14:00-15:00), 토·일 휴진
  function seoulNow() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var h = parseInt(o.hour, 10) % 24;
    return { wd: o.weekday, min: h * 60 + parseInt(o.minute, 10) };
  }
  try {
    var now = seoulNow();
    var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(now.wd) !== -1;
    var state = 'closed', label = '오늘은 휴진입니다';
    if (weekday) {
      if (now.min < 570) { state = 'closed'; label = '진료 전 · 09:30 시작'; }
      else if (now.min >= 840 && now.min < 900) { state = 'lunch'; label = '점심시간 · 15:00 진료 재개'; }
      else if (now.min < 1140) { state = 'open'; label = '지금 진료 중 · 19:00까지'; }
      else { state = 'closed'; label = '오늘 진료가 종료되었습니다'; }
    }
    document.querySelectorAll('.status-pill').forEach(function (el) {
      el.classList.add(state);
      var t = el.querySelector('.status-text');
      if (t) t.textContent = label;
    });
    var map = { Mon: 'mon', Tue: 'mon', Wed: 'mon', Thu: 'mon', Fri: 'mon', Sat: 'sat', Sun: 'sun' };
    var row = document.querySelector('[data-row="' + map[now.wd] + '"]');
    row && row.classList.add('today');
  } catch (e) { /* Intl unsupported: leave static text */ }
})();
