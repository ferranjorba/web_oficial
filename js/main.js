// Navbar: transparent → solid on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');
toggle.addEventListener('click', () => menu.classList.toggle('open'));

// Close mobile menu on link click
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => menu.classList.remove('open'));
});

// Destination filter tabs
const filterBtns = document.querySelectorAll('.filter-btn');
const destCards  = document.querySelectorAll('.dest-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    destCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.dest-card, .service-card, .testimonial-card, .stat-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// Newsletter form
document.querySelector('.newsletter__form').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  input.value = '';
  input.placeholder = 'Subscrit! Gràcies ✓';
  setTimeout(() => { input.placeholder = 'El teu correu electrònic'; }, 3000);
});

// Contact form
document.querySelector('.contact__form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Missatge enviat! ✓';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Enviar consulta';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});
