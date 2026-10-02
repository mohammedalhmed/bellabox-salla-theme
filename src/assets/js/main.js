document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.mobile-nav');
  var overlay = document.querySelector('.mobile-nav-overlay');
  var toggle = document.querySelector('.mobile-menu-toggle');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      if (overlay) overlay.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      nav.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    });
    document.querySelectorAll('[data-mobile-close]').forEach(function (element) {
      element.addEventListener('click', closeMenu);
    });
    nav.querySelectorAll('a').forEach(function (anchor) {
      anchor.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function normalizePath(path) {
    var cleanPath = path || '/';
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
    return cleanPath;
  }

  var currentPath = normalizePath(window.location.pathname);
  document.querySelectorAll('[data-nav-link]').forEach(function (anchor) {
    try {
      var targetPath = normalizePath(new URL(anchor.href, window.location.origin).pathname);
      var isHome = targetPath === normalizePath(new URL(document.querySelector('.brand-lockup')?.href || '/', window.location.origin).pathname);
      var isActive = isHome ? currentPath === targetPath : currentPath === targetPath || currentPath.indexOf(targetPath + '/') === 0;
      anchor.classList.toggle('is-active', isActive);
      if (isActive) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    } catch (error) {
      // Ignore malformed optional links without blocking the rest of the theme.
    }
  });

  document.querySelectorAll('.search-trigger').forEach(function (button) {
    button.addEventListener('click', function () {
      if (window.salla && window.salla.event) window.salla.event.dispatch('search::open');
    });
  });

  var top = document.querySelector('.back-to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-wishlist-id]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!window.salla || !window.salla.wishlist || !window.salla.wishlist.toggle) return;
      var productId = button.getAttribute('data-wishlist-id');
      button.disabled = true;
      Promise.resolve(window.salla.wishlist.toggle(productId)).then(function () {
        var active = !button.classList.contains('active');
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', active ? 'إزالة المنتج من المفضلة' : 'إضافة المنتج إلى المفضلة');
      }).catch(function () {
        // Keep the control usable when authentication or the API request fails.
      }).finally(function () {
        button.disabled = false;
      });
    });
  });

  document.querySelectorAll('.product-thumb').forEach(function (button) {
    button.addEventListener('click', function () {
      var image = document.getElementById('product-main-image');
      if (!image) return;
      var imageSrc = button.getAttribute('data-image-src');
      if (!imageSrc) return;
      image.src = imageSrc;
      image.alt = button.getAttribute('data-image-alt') || image.alt;
      document.querySelectorAll('.product-thumb').forEach(function (item) {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) { event.preventDefault(); });
  });
});
