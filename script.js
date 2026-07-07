/* ==========================================================================
   CACAO SALT PERÚ — script.js
   Vanilla JS: loader, cursor, navbar, scroll reveal, contador animado,
   partículas del hero, carrusel de testimonios, botón volver arriba.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  /* ---------- Cursor personalizado suave ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .benefit-card, .gallery-item, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });

  /* ---------- Navbar: cambia al bajar + menú móvil ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Aparición suave de secciones (scroll reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Contador animado ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ---------- Carrusel de testimonios automático ---------- */
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  let currentTestimonial = 0;
  let testimonialTimer;

  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Ver testimonio ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToTestimonial(i);
      resetTestimonialTimer();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dot');

  function goToTestimonial(index) {
    testimonials[currentTestimonial].classList.remove('active');
    dots[currentTestimonial].classList.remove('active');
    currentTestimonial = index;
    testimonials[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    goToTestimonial(next);
  }

  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(nextTestimonial, 5000);
  }
  resetTestimonialTimer();

  /* ---------- Botón "Volver arriba" ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Partículas sutiles en el Hero ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const heroSection = document.querySelector('.hero');
  let particles = [];

  function resizeCanvas() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }

  function createParticles() {
    const count = window.innerWidth < 760 ? 22 : 45;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.15
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
      ctx.fill();

      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

});