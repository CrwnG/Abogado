/* =============================================
   MEDJUR - Bilingual Language Toggle
   Toggles between Spanish (es) and English (en)
   Default: Spanish
   ============================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'medjur-lang';
  const DEFAULT_LANG = 'es';

  function getPreferredLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyLanguage(lang) {
    // Update all bilingual elements
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      if (el.getAttribute('data-lang') === lang) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    // Update <html lang> attribute
    document.documentElement.setAttribute('lang', lang);

    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      if (btn.getAttribute('data-lang-btn') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update page title if bilingual titles exist
    var titleEs = document.querySelector('meta[name="title-es"]');
    var titleEn = document.querySelector('meta[name="title-en"]');
    if (titleEs && titleEn) {
      document.title = lang === 'es' ? titleEs.content : titleEn.content;
    }

    // Save preference
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function init() {
    var lang = getPreferredLang();
    applyLanguage(lang);

    // Bind toggle buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetLang = btn.getAttribute('data-lang-btn');
        applyLanguage(targetLang);
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
