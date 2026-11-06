/* VinGide.inc – showcases: a big featured photo that rotates on its own,
   plus clickable thumbnails. Used by the Our Work section. */
(function () {
  'use strict';

  var INTERVAL = 5000; // ms each photo stays (change to speed up / slow down)

  function initShowcase(cfg) {
    var root = document.querySelector(cfg.root);
    if (!root) return;

    var figures = root.querySelectorAll(cfg.figure);
    var thumbs = root.querySelectorAll(cfg.thumb);
    var extra = cfg.extra ? document.querySelectorAll(cfg.extra) : [];
    var total = figures.length;
    if (!total) return;
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + total) % total;
      for (var i = 0; i < total; i++) {
        var on = i === current;
        figures[i].classList.toggle('is-active', on);
        if (extra[i]) extra[i].classList.toggle('is-active', on);
        if (thumbs[i]) {
          thumbs[i].classList.toggle('is-active', on);
          thumbs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      }
      if (cfg.onChange) cfg.onChange(current, root);
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      timer = setInterval(function () { show(current + 1); }, INTERVAL);
    }

    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        show(parseInt(btn.getAttribute('data-index'), 10) || 0);
        start(); // restart the countdown after a manual pick
      });
    });

    // pause while the visitor is using the showcase or the tab is hidden
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    start();
  }

  // Our Work: big photo + thumbnails; the big photo opens the matching lightbox (#lb-1…#lb-4)
  initShowcase({
    root: '.work-show',
    figure: '.ws-slide',
    thumb: '.ws-thumb',
    onChange: function (i, root) {
      var link = root.querySelector('.ws-frame');
      if (link) {
        link.setAttribute('href', '#lb-' + (i + 1));
        // restart the light-sweep animation on every change
        link.classList.remove('is-changing');
        void link.offsetWidth;
        link.classList.add('is-changing');
      }
    }
  });
})();
