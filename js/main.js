/* =============================================
   MEDJUR - Main JavaScript
   Sticky header, mobile nav, scroll reveal,
   cursor glow, smooth scroll
   ============================================= */

(function () {
  'use strict';

  /* --- Sticky Header --- */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header || header.classList.contains('site-header--solid')) return;

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 50) {
            header.classList.add('site-header--scrolled');
          } else {
            header.classList.remove('site-header--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Drawer --- */
  function initMobileDrawer() {
    var openBtn = document.querySelector('.mobile-menu-btn');
    var closeBtn = document.querySelector('.mobile-drawer-close');
    var drawer = document.querySelector('.mobile-drawer');
    var backdrop = document.querySelector('.mobile-backdrop');
    if (!drawer || !openBtn) return;

    var focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var isOpen = false;

    function open() {
      isOpen = true;
      drawer.classList.add('mobile-drawer--open');
      backdrop.classList.add('mobile-backdrop--visible');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = drawer.querySelector(focusable);
      if (first) first.focus();
    }

    function close() {
      isOpen = false;
      drawer.classList.remove('mobile-drawer--open');
      backdrop.classList.remove('mobile-backdrop--visible');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      openBtn.focus();
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) close();
    });

    // Focus trap
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen) return;
      var els = drawer.querySelectorAll(focusable);
      var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  /* --- Scroll Reveal with Stagger --- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function (el, i) {
      // Set stagger index
      var parent = el.closest('.stagger-children');
      if (parent) {
        var siblings = parent.querySelectorAll('.reveal');
        var idx = Array.prototype.indexOf.call(siblings, el);
        el.style.setProperty('--i', idx);
      }
      observer.observe(el);
    });

    // Safety: if any reveal is still hidden after 4s, show it
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains('revealed')) {
          el.classList.add('revealed');
        }
      });
    }, 4000);
  }

  /* --- Smooth Scroll --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* --- Active Nav --- */
  function initActiveNav() {
    var path = window.location.pathname.replace(/\/$/, '');
    var file = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === file || (file === '' && href === 'index.html')) {
        link.classList.add('nav-link--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* --- Cursor Glow --- */
  function initCursorGlow() {
    var glow = document.querySelector('.cursor-glow');
    if (!glow || !matchMedia('(hover: hover)').matches) return;

    var x = 0, y = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
    }, { passive: true });

    function animate() {
      curX += (x - curX) * 0.08;
      curY += (y - curY) * 0.08;
      glow.style.transform = 'translate(calc(' + curX + 'px - 50%), calc(' + curY + 'px - 50%))';
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* --- Hero Headline Reveal --- */
  function initHeroReveal() {
    var words = document.querySelectorAll('.hero-headline-word');
    if (!words.length) return;

    words.forEach(function (word, i) {
      setTimeout(function () {
        word.classList.add('revealed');
      }, 300 + i * 120);
    });
  }

  /* --- Drag Scroll for Testimonials --- */
  function initDragScroll() {
    var tracks = document.querySelectorAll('.testimonial-track');
    tracks.forEach(function (track) {
      var isDown = false, startX, scrollLeft;

      track.addEventListener('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      track.addEventListener('mouseleave', function () { isDown = false; });
      track.addEventListener('mouseup', function () { isDown = false; });
      track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeft - (x - startX) * 1.5;
      });
    });
  }

  /* --- Init All --- */
  function init() {
    initStickyHeader();
    initMobileDrawer();
    initScrollReveal();
    initSmoothScroll();
    initActiveNav();
    initCursorGlow();
    initHeroReveal();
    initDragScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
