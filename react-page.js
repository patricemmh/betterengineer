(function () {
  'use strict';

  var reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header shadow */
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

  /* Mobile nav */
  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* Scroll reveal */
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

  /* FAQ accordion */
  var faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-item button');
      if (!btn || !faqList.contains(btn)) return;
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-panel');
      var open = item.classList.contains('is-open');

      faqList.querySelectorAll('.faq-item').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var b = other.querySelector('button');
        var p = other.querySelector('.faq-panel');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (p) p.hidden = true;
      });

      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) panel.hidden = open;
    });

    /* Init aria / hidden to match first open item */
    faqList.querySelectorAll('.faq-item').forEach(function (item, i) {
      var btn = item.querySelector('button');
      var panel = item.querySelector('.faq-panel');
      var isOpen = item.classList.contains('is-open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (panel) panel.hidden = !isOpen;
    });
  }

  /* Fairy dust on hero CTA */
  var dustWrap = document.getElementById('fairy-dust-wrap');
  if (dustWrap && !reduceMotion) {
    var particleId = 0;
    var intervalId = null;
    var colors = ['#f0abfc', '#e9d5ff', '#fef08a', '#ffffff', '#ddd6fe', '#fbcfe8'];

    function removeParticle(node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }

    function spawnBurst() {
      var rect = dustWrap.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      for (var i = 0; i < 4; i++) {
        var x = Math.random() * w;
        var y = h * 0.15 + Math.random() * h * 0.55;
        var angle = Math.random() * Math.PI * 2;
        var dist = 36 + Math.random() * 55;
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist - (18 + Math.random() * 25);
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size = 3 + Math.random() * 5;

        var span = document.createElement('span');
        span.className = 'fairy-dust-particle';
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        span.style.setProperty('--tx', tx + 'px');
        span.style.setProperty('--ty', ty + 'px');
        span.style.background = color;
        span.style.boxShadow = '0 0 8px ' + color + ', 0 0 14px rgba(255,255,255,0.45)';

        particleId += 1;
        dustWrap.insertBefore(span, dustWrap.firstChild);

        span.addEventListener(
          'animationend',
          function (el) {
            return function () {
              removeParticle(el);
            };
          }(span),
          { once: true },
        );
      }
    }

    function trimParticles() {
      var nodes = dustWrap.querySelectorAll('.fairy-dust-particle');
      if (nodes.length > 80) {
        for (var j = 0; j < nodes.length - 80; j++) {
          removeParticle(nodes[j]);
        }
      }
    }

    dustWrap.addEventListener('mouseenter', function () {
      spawnBurst();
      intervalId = setInterval(function () {
        spawnBurst();
        trimParticles();
      }, 85);
    });

    dustWrap.addEventListener('mouseleave', function () {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      dustWrap.querySelectorAll('.fairy-dust-particle').forEach(removeParticle);
    });
  }

  var HS_TARGET_ID = 'hubspot-form-72hr';
  function mountHubSpot72() {
    var el = document.getElementById(HS_TARGET_ID);
    if (!el || !window.hbspt) return;
    if (el.getAttribute('data-hs-injected')) return;
    el.setAttribute('data-hs-injected', 'true');
    window.hbspt.forms.create({
      region: 'na1',
      portalId: '8679235',
      formId: '4431ddc0-7bea-46ba-939c-98c422756479',
      target: '#' + HS_TARGET_ID,
    });
  }
  var hsSrc = 'https://js.hsforms.net/forms/embed/v2.js';
  var hsScript = document.querySelector('script[src="' + hsSrc + '"]');
  if (document.getElementById(HS_TARGET_ID)) {
    if (!hsScript) {
      hsScript = document.createElement('script');
      hsScript.src = hsSrc;
      hsScript.charset = 'utf-8';
      hsScript.async = true;
      hsScript.onload = function () {
        requestAnimationFrame(mountHubSpot72);
      };
      document.body.appendChild(hsScript);
    } else if (window.hbspt) {
      requestAnimationFrame(mountHubSpot72);
    } else {
      hsScript.addEventListener('load', function () {
        requestAnimationFrame(mountHubSpot72);
      }, { once: true });
    }
  }
})();
