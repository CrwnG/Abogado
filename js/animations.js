/* =============================================
   MEDJUR - Advanced Animations
   Text cycling, parallax, counter animation
   ============================================= */

(function () {
  'use strict';

  /* --- Text Cycling Animation --- */
  function initTextCycle() {
    var cycles = document.querySelectorAll('.text-cycle');
    if (!cycles.length) return;

    cycles.forEach(function (cycle) {
      var items = cycle.querySelectorAll('.text-cycle__item');
      if (items.length < 2) return;

      var current = 0;
      items[0].classList.add('active');

      // Set width to widest item
      var maxWidth = 0;
      items.forEach(function (item) {
        item.style.position = 'relative';
        item.style.visibility = 'hidden';
        var w = item.offsetWidth;
        if (w > maxWidth) maxWidth = w;
        item.style.position = '';
        item.style.visibility = '';
      });
      cycle.style.width = maxWidth + 'px';

      setInterval(function () {
        var prev = current;
        current = (current + 1) % items.length;

        items[prev].classList.remove('active');
        items[prev].classList.add('exit');

        items[current].classList.add('active');

        setTimeout(function () {
          items[prev].classList.remove('exit');
        }, 600);
      }, 3000);
    });
  }

  /* --- Animated Counter --- */
  function initCounters() {
    var counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2500;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var val = Math.floor(easeOutQuart(progress) * target);
        el.textContent = val.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* --- Simple Parallax --- */
  function initParallax() {
    var elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
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
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
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

  /* --- Magnetic Button Effect --- */
  function initMagneticButtons() {
    if (!matchMedia('(hover: hover)').matches) return;

    var buttons = document.querySelectorAll('.btn-primary, .btn-ghost');
    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* --- Init --- */
  function init() {
    initTextCycle();
    initCounters();
    initParallax();
    initStatsMorphing();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
