(() => {
  'use strict';

  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = () => window.innerWidth < 700;
  let width = 0;
  let height = 0;
  let points = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createPoints();
  }

  function createPoints() {
    const count = isSmall() ? 32 : 62;
    points = Array.from({ length: count }, (_, id) => ({
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const maxDistance = isSmall() ? 125 : 165;

    points.forEach((p) => {
      if (!reducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.fillStyle = 'rgba(112,245,200,.48)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,140,255,${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (!reducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Build the mail address only when a visitor activates the contact CTA.
  // Character codes avoid storing the address as a readable email string.
  document.querySelectorAll('.contact-trigger').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const address = String.fromCharCode(
        97,110,107,117,115,104,116,104,97,107,117,114,49,50,64,
        104,111,116,109,97,105,108,46,99,111,109
      );
      window.location.href = `mailto:${address}`;
    });
  });
})();
