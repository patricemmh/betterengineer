(function () {
  'use strict';

  var reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var HS_UTM_KEYS = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'utm_id'];

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (e) {
      // Ignore storage access failures.
    }
  }

  function captureAttribution() {
    var params = new URLSearchParams(window.location.search || '');
    HS_UTM_KEYS.forEach(function (key) {
      var value = (params.get(key) || '').trim();
      if (value) safeSessionSet(key, value);
    });

    var landing = safeSessionGet('hs_landing_page');
    if (!landing) safeSessionSet('hs_landing_page', window.location.href);

    var referrer = (document.referrer || '').trim();
    if (referrer && !safeSessionGet('hs_original_referrer')) {
      safeSessionSet('hs_original_referrer', referrer);
    }
  }

  function getHsqQueue() {
    window._hsq = window._hsq || [];
    return window._hsq;
  }

  function sanitizeEventName(raw) {
    return (raw || 'interaction')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 64) || 'interaction';
  }

  function trackVirtualView(eventName) {
    var q = getHsqQueue();
    var basePath = window.location.pathname || '/';
    q.push(['setPath', basePath + '?hs_evt=' + sanitizeEventName(eventName)]);
    q.push(['trackPageView']);
    q.push(['setPath', window.location.pathname + window.location.search]);
  }

  function bindHubSpotClickTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a.btn, a.btn-nav, button.btn');
      if (!target) return;
      var explicitName = target.getAttribute('data-hs-event');
      var textName = (target.textContent || '').trim();
      var eventName = explicitName || ('cta_' + textName);
      trackVirtualView(eventName);
    });
  }

  captureAttribution();
  bindHubSpotClickTracking();

  var header = document.getElementById('header');
  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      },
      { passive: true },
    );
  }

  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll('#main .reveal').forEach(function (el) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(el);
    });
  } else {
    document.querySelectorAll('#main .reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var SLIDE_COUNT = 3;
  var slide = 0;
  function showSlide(i) {
    slide = ((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
    var root = document.getElementById('testimonials');
    if (!root) return;
    var slides = root.querySelectorAll('.slide');
    var dots = root.querySelectorAll('.carousel-dots button');
    slides.forEach(function (el, idx) {
      el.classList.toggle('is-active', idx === slide);
      el.setAttribute('aria-hidden', idx === slide ? 'false' : 'true');
    });
    dots.forEach(function (btn, idx) {
      btn.classList.toggle('is-active', idx === slide);
      btn.setAttribute('aria-selected', idx === slide ? 'true' : 'false');
    });
  }

  var testimonials = document.getElementById('testimonials');
  if (testimonials) {
    var prevBtn = testimonials.querySelector('.carousel-btn[aria-label="Previous testimonial"]');
    var nextBtn = testimonials.querySelector('.carousel-btn[aria-label="Next testimonial"]');
    var dots = testimonials.querySelector('.carousel-dots');
    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(slide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(slide + 1); });
    if (dots) {
      dots.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || !dots.contains(b)) return;
        var idx = parseInt(b.getAttribute('data-slide-index'), 10);
        if (!isNaN(idx)) showSlide(idx);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showSlide(slide - 1);
      if (e.key === 'ArrowRight') showSlide(slide + 1);
    });
    showSlide(0);
  }
})();
