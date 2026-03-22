/* =============================================
   MEDJUR - Advanced Animations
   Text cycling, parallax, counters, magnetic,
   staggered reveals, smooth entrances
   ============================================= */

(function () {
  'use strict';

  /* --- Text Cycling Animation --- */
  function initTextCycle() {
    var cycles = document.querySelectorAll('.text-cycle:not(.hidden)');
    if (!cycles.length) return;

    cycles.forEach(function (cycle) {
      var items = cycle.querySelectorAll('.text-cycle__item');
      if (items.length < 2) return;

      // Reset all items
      items.forEach(function (item) {
        item.classList.remove('active', 'exit');
      });

      var current = 0;
      items[0].classList.add('active');

      // Measure widest item for fixed container width
      var maxWidth = 0;
      items.forEach(function (item) {
        // Temporarily make visible to measure
        var origOpacity = item.style.opacity;
        var origTransform = item.style.transform;
        item.style.opacity = '0';
        item.style.transform = 'none';
        item.style.position = 'static';
        var w = item.offsetWidth;
        if (w > maxWidth) maxWidth = w;
        item.style.opacity = origOpacity;
        item.style.transform = origTransform;
        item.style.position = '';
      });
      cycle.style.width = (maxWidth + 4) + 'px';

      var isAnimating = false;

      setInterval(function () {
        if (isAnimating) return;
        isAnimating = true;

        var prev = current;
        current = (current + 1) % items.length;

        // Exit current word
        items[prev].classList.remove('active');
        items[prev].classList.add('exit');

        // Enter new word (slight delay for cleaner transition)
        setTimeout(function () {
          items[current].classList.add('active');
        }, 80);

        // Cleanup exit class after transition completes
        setTimeout(function () {
          items[prev].classList.remove('exit');
          isAnimating = false;
        }, 550);
      }, 3000);
    });
  }

  /* --- Reinitialize text cycle on language change --- */
  function watchLanguageChange() {
    var observer = new MutationObserver(function () {
      // Small delay to let lang.js finish toggling
      setTimeout(initTextCycle, 100);
    });
    var html = document.documentElement;
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
  }

  /* --- Number Morphing (for stats in marquee) --- */
  function initStatsMorphing() {
    var stats = document.querySelectorAll('.stat-number[data-target]');
    if (!stats.length) return;

    if (!('IntersectionObserver' in window)) {
      stats.forEach(function (el) {
        el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 2000;
          var start = null;

          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            var val = Math.floor(eased * target);
            el.textContent = val.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString() + suffix;
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    stats.forEach(function (el) { observer.observe(el); });
  }

  /* --- Animated Counter (for counter-value class) --- */
  function initCounters() {
    var counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 2500;
          var start = null;

          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString() + suffix;
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* --- Simple Parallax --- */
  function initParallax() {
    var elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Disable on mobile for performance
    if (window.innerWidth < 768) return;

    var ticking = false;

    function updateParallax() {
      var viewH = window.innerHeight;

      elements.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;

        if (rect.bottom > 0 && rect.top < viewH) {
          var yPos = (rect.top - viewH / 2) * speed;
          el.style.transform = 'translateY(' + yPos + 'px)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Magnetic Button Effect (desktop only) --- */
  function initMagneticButtons() {
    if (!matchMedia('(hover: hover)').matches) return;

    var buttons = document.querySelectorAll('.btn-primary, .btn-ghost');
    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.12) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* --- Section line draw animation --- */
  function initLineAnimations() {
    var lines = document.querySelectorAll('.hero-line');
    lines.forEach(function (line, i) {
      line.style.opacity = '0';
      setTimeout(function () {
        line.style.transition = 'opacity 1.5s ease';
        line.style.opacity = '0.3';
      }, 1500 + i * 400);
    });
  }

  /* --- Smooth entrance for hero eyebrow --- */
  function initEyebrowEntrance() {
    var eyebrow = document.querySelector('.hero-eyebrow');
    if (!eyebrow) return;
    eyebrow.style.opacity = '0';
    eyebrow.style.transform = 'translateY(20px)';
    eyebrow.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(function () {
      eyebrow.style.opacity = '1';
      eyebrow.style.transform = 'translateY(0)';
    }, 200);
  }

  /* --- Smooth entrance for hero subtitle & CTAs --- */
  function initHeroContentEntrance() {
    var subtitle = document.querySelector('.hero-subtitle');
    var ctaGroup = document.querySelector('.hero .flex, .hero--inner .flex');

    var els = [subtitle, ctaGroup].filter(Boolean);
    els.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(function () {
        el.style.opacity = '';
        el.style.transform = '';
        // Trigger by removing inline styles to let CSS take over
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 800 + i * 200);
    });
  }

  /* --- Scroll progress indicator (thin line at top) --- */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--ensign,#1B3A5C);z-index:9999;width:0;transition:width 0.1s linear;pointer-events:none;';
    document.body.appendChild(bar);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
          bar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Init --- */
  function init() {
    initTextCycle();
    watchLanguageChange();
    initCounters();
    initStatsMorphing();
    initParallax();
    initMagneticButtons();
    initLineAnimations();
    initEyebrowEntrance();
    initHeroContentEntrance();
    initScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
