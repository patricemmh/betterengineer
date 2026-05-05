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

  var HS_PORTAL_ID = '8679235';
  var HS_FORM_ID = '4431ddc0-7bea-46ba-939c-98c422756479';
  var hsSubmitEndpoint = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL_ID + '/' + HS_FORM_ID;

  function getCookie(name) {
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var key = parts.shift();
      if (key === name) return decodeURIComponent(parts.join('='));
    }
    return '';
  }

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

  function setFieldError(field, isInvalid) {
    if (!field) return;
    field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  }

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (kind === 'success') el.classList.add('is-success');
    if (kind === 'error') el.classList.add('is-error');
  }

  function getHubSpotErrorMessage(data) {
    if (!data) return '';
    if (data.errors && data.errors.length && data.errors[0] && data.errors[0].message) {
      return data.errors[0].message;
    }
    if (data.validationResults && data.validationResults.length && data.validationResults[0].message) {
      return data.validationResults[0].message;
    }
    if (data.message) return data.message;
    return '';
  }

  function wireReactIntakeForm() {
    var form = document.getElementById('react-intake-form');
    if (!form) return;
    var status = document.getElementById('react-intake-status');
    var utmKeys = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'];
    var params = new URLSearchParams(window.location.search || '');

    utmKeys.forEach(function (key) {
      var queryValue = (params.get(key) || '').trim();
      var storedValue = safeSessionGet(key);
      var finalValue = queryValue || storedValue || '';
      var field = form.querySelector('[name="' + key + '"]');
      if (field) field.value = finalValue;
      if (queryValue) {
        safeSessionSet(key, queryValue);
      }
    });

    var requiredFields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var formStartedTracked = false;
    form.addEventListener('input', function () {
      if (formStartedTracked) return;
      formStartedTracked = true;
      trackVirtualView('react_form_started');
    });
    requiredFields.forEach(function (field) {
      field.addEventListener('input', function () {
        setFieldError(field, !field.value.trim());
      });
      field.addEventListener('blur', function () {
        setFieldError(field, !field.value.trim());
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setStatus(status, '', '');

      var formData = new FormData(form);
      var values = {
        firstname: (formData.get('firstname') || '').trim(),
        lastname: (formData.get('lastname') || '').trim(),
        email: (formData.get('email') || '').trim(),
        message: (formData.get('message') || '').trim(),
        utm_campaign: (formData.get('utm_campaign') || '').trim(),
        utm_content: (formData.get('utm_content') || '').trim(),
        utm_medium: (formData.get('utm_medium') || '').trim(),
        utm_source: (formData.get('utm_source') || '').trim(),
      };

      var hasError = false;
      requiredFields.forEach(function (field) {
        var val = (values[field.name] || '').trim();
        var invalid = !val;
        setFieldError(field, invalid);
        if (invalid) hasError = true;
      });
      if (hasError) {
        setStatus(status, 'Please complete all required fields before submitting.', 'error');
        return;
      }

      var emailField = form.querySelector('[name="email"]');
      var looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      if (!looksLikeEmail) {
        setFieldError(emailField, true);
        setStatus(status, 'Please enter a valid work email address.', 'error');
        return;
      }

      var fields = [
        { name: 'firstname', value: values.firstname },
        { name: 'lastname', value: values.lastname },
        { name: 'email', value: values.email },
        { name: 'message', value: values.message },
      ];

      utmKeys.forEach(function (key) {
        if (values[key]) fields.push({ name: key, value: values[key] });
      });

      var context = {
        pageUri: window.location.href,
        pageName: document.title,
      };
      var hutk = getCookie('hubspotutk');
      if (hutk) {
        context.hutk = hutk;
      }

      var payload = {
        fields: fields,
        context: context,
      };

      form.classList.add('is-submitting');
      form.setAttribute('aria-busy', 'true');
      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      fetch(hsSubmitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (res.ok) return null;
          return res.json()
            .then(function (data) { return data; })
            .catch(function () { return null; })
            .then(function (data) {
              var error = new Error('HubSpot submission failed.');
              error.data = data;
              throw error;
            });
        })
        .then(function () {
          form.reset();
          requiredFields.forEach(function (field) { setFieldError(field, false); });
          setStatus(status, 'Thanks. Your request was sent. A staffing specialist will contact you shortly.', 'success');
          trackVirtualView('react_form_submit_success');
        })
        .catch(function (err) {
          var genericMessage = 'We could not submit right now. Please try again in a moment.';
          var hubspotMessage = err && err.data ? getHubSpotErrorMessage(err.data) : '';
          if (hubspotMessage) {
            genericMessage = hubspotMessage;
          }
          setStatus(status, genericMessage, 'error');
          trackVirtualView('react_form_submit_error');
        })
        .finally(function () {
          form.classList.remove('is-submitting');
          form.removeAttribute('aria-busy');
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

  captureAttribution();
  bindHubSpotClickTracking();
  wireReactIntakeForm();
})();
