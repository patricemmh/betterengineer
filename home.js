(function () {
  'use strict';

  var reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
