(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORS = ['#4F6DFF', '#7C8CFF', '#B8C2FF', '#6B7FFF', '#A5B4FC'];
  var COUNT = 6;
  var STAR_CLIP = 'polygon(50% 0%, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0% 50%, 45% 45%)';

  function burst(x, y) {
    for (var i = 0; i < COUNT; i++) {
      (function (i) {
        var size = 4 + Math.random() * 5;
        var isStar = Math.random() > 0.55;
        var color = COLORS[Math.floor(Math.random() * COLORS.length)];
        var angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.9;
        var distance = 22 + Math.random() * 28;
        var duration = 500 + Math.random() * 300;

        var el = document.createElement('div');
        el.setAttribute('style', [
          'position:fixed',
          'left:' + x + 'px',
          'top:' + y + 'px',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'pointer-events:none',
          'z-index:99999',
          'border-radius:' + (isStar ? '0' : '50%'),
          'background:' + color,
          isStar ? 'clip-path:' + STAR_CLIP : '',
          'transform:translate(-50%,-50%)',
          'will-change:transform,opacity',
          'opacity:1',
        ].filter(Boolean).join(';'));

        document.body.appendChild(el);

        var tx = Math.cos(angle) * distance;
        var ty = Math.sin(angle) * distance;
        var start = performance.now();

        (function animate(now) {
          var t = Math.min((now - start) / duration, 1);
          var e = 1 - Math.pow(1 - t, 3); // ease-out cubic
          el.style.transform = 'translate(calc(-50% + ' + (tx * e) + 'px), calc(-50% + ' + (ty * e) + 'px))';
          el.style.opacity = String(1 - t);
          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            el.parentNode && el.parentNode.removeChild(el);
          }
        }(start));
      }(i));
    }
  }

  document.addEventListener('pointerdown', function (e) {
    burst(e.clientX, e.clientY);
  });
}());
